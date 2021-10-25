"""
Utilities for submission query from ElasticSearch
"""
import pandas as pd
from typing import Optional

from pytz import timezone
from datetime import timedelta

from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

es = Elasticsearch(
    [
        {"host": "localhost", "port": 9200},
    ]
)
utc = timezone("UTC")


def convert_utc(dt: str):
    """Convert datetime in string to UTC"""
    utc = timezone("UTC")
    dt = pd.to_datetime(dt)
    if dt.tzinfo is None:
        dt = utc.localize(dt)
    return dt


def convert_es_responses_to_list(search_responses: list):
    """
    Convert responses from ElasticSearch to list.
    This will be used in the backend
    """
    submissions = []
    for response in search_responses:
        submission = response["_source"]
        submission["score"] = response["_score"]
        submission["submission_id"] = response["_id"]
        submissions.append(submission)
    return submissions


def query(
    q: Optional[str] = None,
    n_results: Optional[int] = None,
    index: str = "grid",
    fields: list = [],
):
    """
    Query string from a given index

    q: str, query string
    n_results: int, number of results
    index: str, index of ElasticSearch, default grid
    fields: search fields
    """
    es_search = Search(using=es, index=index)
    if q is None or q.strip() == "":
        search_responses = [hit.to_dict() for hit in es_search.scan()]
    else:
        if n_results is None:
            n_results = es_search.count()
        responses = es_search.query("multi_match", query=q, fields=fields)
        search_responses = responses[0:n_results].execute()
        search_responses = search_responses.to_dict()["hits"]["hits"]
        if index != "grid":
            search_responses = convert_es_responses_to_list(search_responses)
    return search_responses


def query_affiliations(
    q: str = "University of Pennsylvania",
    n_results: int = 10,
    index: str = "grid",
    fields: list = ["Name"],
):
    """
    Query affiliation from a GRID index,
    assuming that GRID data is indexed via the scripts.
    """
    responses = query(q, n_results, index, fields)
    query_suggestions = [f"{response['_source']['Name']}" for response in responses]
    return list(pd.unique(query_suggestions))


def query_abstracts(
    q: Optional[str] = None,
    n_results: Optional[int] = None,
    index: str = "agenda-2020-1",
    fields: list = ["title^2", "abstract", "fullname", "institution"],
):
    """
    Query abstracts from a given Elastic index

    q: str, query
    n_results: int, number of results from
    index: str, index of ElasticSearch
    fields: list, list of fields that are included in the search
    """
    responses = query(q, n_results, index, fields)
    return responses


def get_agenda(
    index: str = "agenda-2020-1", starttime: Optional[str] = None, sort: bool = True
):
    """
    Returns agenda one day after a given starttime from a given index.
    Note: If starttime and endtime are not available, we will return empty agenda.

    Parameters
    ==========
    index: str, ElasticSearch index
    starttime: str, a given string of starttime such as
        2020-10-26 10:00:00, 2020-10-26 10:00:00+00:00
        assuming that starttime is in UTC
    """
    agenda = []
    for hit in Search(using=es, index=index).scan():
        # check if starttime and endtime both available
        if (
            hit.to_dict().get("starttime") is not None
            and hit.to_dict().get("endtime") is not None
        ):
            dt_start = pd.to_datetime(hit["starttime"])
            dt_end = pd.to_datetime(hit["endtime"])

            if (starttime is not None) or (starttime == ""):
                startday = convert_utc(starttime)
                endday = startday + timedelta(days=1) - timedelta(minutes=1)
                if dt_start >= startday and dt_end <= endday:
                    hit["starttime"] = dt_start.isoformat()
                    hit["endtime"] = dt_end.isoformat()
                    agenda.append(hit.to_dict())
            else:
                agenda.append(hit.to_dict())
    # sort agenda if sort is True
    if sort:
        agenda = sorted(agenda, key=lambda x: pd.to_datetime(x["starttime"]))
    return agenda


def filter_startend_time(
    responses: list,
    starttime: str = None,
    endtime: str = None,
):
    """
    Filter a list by starttime and endtime
    """
    if starttime in ["", None] and endtime in ["", None]:
        return responses
    else:
        # assuming UTC for all given timezones if tzinfo is None, localize by UTC
        starttime = pd.to_datetime(starttime)
        endtime = pd.to_datetime(endtime)
        if starttime.tzinfo is None:
            starttime = utc.localize(starttime)
        if endtime.tzinfo is None:
            endtime = utc.localize(endtime)

        # filtering
        submissions = []
        for hit in responses:
            if (
                convert_utc(hit["starttime"]) >= starttime
                and convert_utc(hit["endtime"]) <= endtime
            ):
                submissions.append(hit)
        return submissions
