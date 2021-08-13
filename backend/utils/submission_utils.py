"""
Utilities for submission query from ElasticSearch
"""
import pandas as pd
from typing import Optional

from pytz import timezone
from datetime import timedelta

from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

es = Elasticsearch([
    {"host": "localhost", "port": 9200},
])


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


def query(q: str,  n_results: int = 10, index: str = "grid", fields: list = []):
    """
    Query string from a given index
    
    q: str, query string
    n_results: int, number of results
    index: str, index of ElasticSearch, default grid
    fields: search fields
    """
    es_search = Search(using=es, index=index)
    if n_results is None:
        n_results = es_search.count()
    responses = es_search.query(
        "multi_match",
        query=q,
        fields=fields
    )
    search_responses = responses[0:n_results].execute()
    search_responses = search_responses.to_dict()['hits']['hits']
    return search_responses


def query_affiliations(
    q: str = "University of Pennsylvania",
    n_results: int = 10,
    index: str = "grid",
    fields: list = ["Name"]
):
    """
    Query affiliation from a GRID index,
    assuming that GRID data is indexed via the scripts.
    """
    responses = query(q, n_results, index, fields)
    query_suggestions = [
        f"{response['_source']['Name']}"
        for response in responses
    ]
    return list(pd.unique(query_suggestions))


def query_abstracts(
    q: str = "Neuron",
    n_results: int = 10,
    index: str = "agenda-2020-1",
    fields: list = ["title^2", "abstract", "fullname", "institution"]
):
    """
    Query abstracts from a given Elastic index

    q: str, query
    n_results: int, number of results from
    index: str, index of ElasticSearch
    fields: list, list of fields that are included in the search
    """
    responses = query(q, n_results, index, fields)
    output_responses = convert_es_responses_to_list(responses)
    return output_responses


def get_agenda(index: str = "agenda-2020-1", starttime: Optional[str] = None):
    """
    Returns agenda one day after a given starttime from a given index

    index: str, ElasticSearch index
    starttime: str, a given string of starttime such as
        2020-10-26 10:00:00, 2020-10-26 10:00:00+00:00
        assuming that starttime is in UTC
    """
    utc = timezone('UTC')

    agenda = []
    for hit in Search(using=es, index=index).scan():
        hit["starttime_sort"] = pd.to_datetime(hit["starttime"])
        hit["endtime_sort"] = pd.to_datetime(hit["endtime"])

        if (starttime is not None) or (starttime == ""):
            startday = pd.to_datetime(starttime)
            if startday.tzinfo is None:
                startday = utc.localize(startday)
            endday = startday + timedelta(days=1) - timedelta(minutes=1)
            if (hit["starttime_sort"] >= startday and
                hit["endtime_sort"] <= endday):
                hit["starttime"] = hit["starttime_sort"].isoformat()
                hit["endtime"] = hit["endtime_sort"].isoformat()
                agenda.append(hit.to_dict())
        else:
            agenda.append(hit.to_dict())

    return agenda