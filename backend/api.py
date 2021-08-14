import os
import os.path as op
import json
import yaml
from glob import glob
from typing import List, Dict, Optional
from dotenv import load_dotenv
load_dotenv(dotenv_path='.backend.env') # setting all credentials here

import joblib
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
import pandas as pd
from pydantic import BaseModel
from pyairtable import Table
import utils # import utils as a library
from utils import get_user_info, get_data, set_data

from fastapi import FastAPI, Query, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import google.cloud
from google.oauth2 import id_token
from google.auth.transport.requests import Request

# get Firebase collections
with open("../sitedata/config.yml") as f:
    site_config = yaml.load(f, Loader=yaml.FullLoader)
current_edition = site_config["current_edition"]
collections = site_config["firebase-collection"][current_edition]
user_collection = collections["users"]
preference_collection = collections["preferences"]

with open("../scripts/es_config.yml") as f:
    es_config = yaml.load(f, Loader=yaml.FullLoader)
es = Elasticsearch([{
    'host': es_config["host"],
    'port': es_config["port"]
}])

# loading model and embeddings
model_paths = glob("../sitedata/embeddings/*.joblib")
embedding_paths = glob("../sitedata/embeddings/*.json")
if len(model_paths) > 0:
    nbrs_models = {
        op.basename(path).split('.')[0]: joblib.load(path)
        for path in model_paths
    }
if len(embedding_paths) > 0:
    embeddings = {
        op.basename(path).split('.')[0]: json.load(open(path, 'r'))
        for path in glob("../sitedata/embeddings/*.joblib")
    }
airtable_key = os.environ.get("AIRTABLE_KEY")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:4000",
        "http://localhost:9200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
HTTP_REQUEST = Request()


class Submission(BaseModel):
    submission_id: Optional[str] = None
    title: str = ""
    abstract: str = ""
    fullname: str = ""
    coauthors: Optional[str] = None
    institution: Optional[str] = None
    theme: Optional[str] = None
    talk_format: str
    # below fields are created by organizers
    starttime: Optional[str] = None
    endtime: Optional[str] = None
    url: Optional[str] = None
    track: Optional[str] = None


class Vote(BaseModel):
    """
    Vote a submission ID in a given edition
    """
    edition: str
    submission_id: str
    action: str # vote action, can be "like" | "dislike"


# profile
@app.get("/api/affiliation")
async def get_affiliations(q: Optional[str] = Query(None), n_results: Optional[int] = Query(10)):
    """Query affiliation listed in GRID database from ElasticSearch
    """
    if n_results is None:
        n_results = 10
    if q is not None:
        queries = utils.query_affiliations(q, n_results=n_results)
    else:
        queries = []
    return JSONResponse(content={"data": queries})


@app.post("/api/confirmation")
async def send_confirmation_email():
    # TODOs: send email confirmation
    return None


@app.post("/api/migration")
async def migrate():
    # TODOs: find previous user profile and migrate to the current one
    return None


@app.get("/api/user")
async def get_user():
    # TODOs: find user from a given user ID
    return None


@app.post("/api/user")
async def create_user():
    # TODOs: create user
    return None


@app.put("/api/user")
async def update_user():
    # TODOs: update user data
    return None


# abstract search
@app.get("/api/abstract/{edition}")
async def get_abstracts(
    edition: str,
    q: Optional[str] = Query(None),
    view: Optional[str] = Query("default"),
    starttime: Optional[str] = Query(None),
    endtime: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(40)
):
    """
    Query abstracts from a given edition

    edition: str, such as 2020-1, 2020-2, 2020-3
    q: Optional[str], query string
    view: Optional[str], can be "default" | "your-votes" | "recommendations" | "personalized"
    skip: int = 0, skip parameter
    limit: int = 40, limit parameter
    """
    es_search = Search(using=es, index=f"agenda-{edition}")
    n_submissions = es_search.count()
    page_size = limit # set page size to equal to limit
    current_page = int(skip / page_size) + 1
    n_page = int(n_submissions / page_size) + 1
    starttime = utils.convert_utc(starttime)
    endtime = utils.convert_utc(endtime)

    if current_page > n_page:
        return JSONResponse(content={
            "meta": {
                "currentPage": current_page,
                "totalPage": n_page,
                "pageSize": page_size
            },
            "data": []
        })

    if view == "default":
        submissions = utils.query_abstracts(q, index=f"agenda-{edition}") # get all responses
        submissions = utils.filter_startend_time(submissions, starttime, endtime) # filter by start, end time

        return JSONResponse(content={
            "meta": {
                "currentPage": current_page,
                "totalPage": n_page,
                "pageSize": page_size
            },
            "links": {
                "current": f"/api/abstract/{edition}?view={view}&query={q}&starttime={starttime}&endtime={endtime}&skip={skip}&limit={page_size}",
                "next": f"/api/abstract/{edition}?view={view}&query={q}&starttime={starttime}&endtime={endtime}&skip={skip + page_size}&limit={page_size}"
            },
            "data": submissions[skip: skip + limit]
        })
    elif view == "your-votes":
        # TODOs: get votes for generating votes
        submission_ids = []
        submissions = [
            utils.get_abstract(index=f"agenda-{edition}", id=idx)
            for idx in submission_ids
        ]
        return JSONResponse(content={
            "meta": {
                "currentPage": int(skip / page_size) + 1,
                "totalPage": int(len(submissions) / page_size) + 1,
                "pageSize": page_size
            },
            "links": {
                "current": f"/api/abstract/{edition}?view={view}&sort={sort}&skip={skip}&limit={page_size}",
                "next": f"/api/abstract/{edition}?view={view}&sort={sort}&skip={skip + page_size}&limit={page_size}"
            },
            "data": []
        })
    elif view == "recommendations":
        # TODOs: get votes for generating recommendations
        submission_ids = []
        submissions = utils.generate_recommendations(
            submission_ids,
            data=embeddings,
            index=f"agenda-{edition}",
            nbrs_model=nbrs_models[f"agenda-{edition}"],
            exploration=False,
            abstract_info=True
        )
        submissions = utils.filter_startend_time(submissions, starttime, endtime)
        return JSONResponse(content={
            "meta": {
                "currentPage": int(skip / page_size) + 1,
                "totalPage": int(len(submissions) / page_size) + 1,
                "pageSize": page_size
            },
            "links": {
                "current": f"/api/abstract/{edition}?view={view}&starttime={starttime}&endtime={endtime}&skip={skip}&limit={page_size}",
                "next": f"/api/abstract/{edition}?view={view}&starttime={starttime}&endtime={endtime}&skip={skip + page_size}&limit={page_size}"
            },
            "data": submissions[skip:skip + limit] if len(submissions) > 0 else []
        })
    elif view == "personalized":
        # TODOs: get votes for generating personalized recommendation
        submission_ids = []
        submissions = utils.generate_personalized_recommendations(
            submission_ids,
            data=embeddings,
            index=f"agenda-{edition}",
            nbrs_model=nbrs_models[f"agenda-{edition}"]
        )
        submissions = utils.filter_startend_time(submissions, starttime, endtime)
        return JSONResponse(content={
            "meta": {
                "currentPage": int(skip / page_size) + 1,
                "totalPage": int(len(submissions) / page_size) + 1,
                "pageSize": page_size
            },
            "links": {
                "current": f"/api/abstract/{edition}?view={view}&starttime={starttime}&endtime={endtime}&skip={skip}&limit={page_size}",
                "next": f"/api/abstract/{edition}?view={view}&starttime={starttime}&endtime={endtime}&skip={skip + page_size}&limit={page_size}"
            },
            "data": submissions[skip:skip + limit] if len(submissions) > 0 else []
        })
    else:
        return JSONResponse(content={
            "meta": {
                "currentPage": current_page,
                "totalPage": n_page,
                "pageSize": page_size
            },
            "links": {
                "current": f"/api/abstract/{edition}?view=default&skip={skip}&limit={page_size}",
                "next": f"/api/abstract/{edition}?view=default&skip={skip + page_size}&limit={page_size}"
            },
            "data": []
        })


# abstract get, create, and update
@app.get("/api/abstract/{edition}/{submission_id}")
async def get_abstract(edition: str, submission_id: str):
    """
    Get an abstract with submission id from a given edition

    Note: This will retrieve from ElasticSearch in case Airtable
        is not specified
    """
    base_id = es_config["editions"][edition].get("airtable_id")
    table_name = es_config["editions"][edition].get("table_name")
    if base_id is None:
        # query from Elasticsearch
        abstract = utils.get_abstract(index=f"agenda-{edition}", id=submission_id)
    else:
        # query from Airtable
        table = Table(api_key=airtable_key, base_id=base_id, table_name=table_name)
        abstract = table.get(submission_id) # return abstract from Airtable
    return JSONResponse(content={"data": abstract})


@app.post("/api/abstract/{edition}")
async def create_abstract(submission: Submission, edition: str):
    """
    Submit an abstract to Airtable
    """
    submission = submission.dict()

    if submission["starttime"] not in ["", None] and submission["endtime"] not in ["", None]:
        submission["starttime"] = str(pd.to_datetime(submission["starttime"]))
        submission["endtime"] = str(pd.to_datetime(submission["endtime"]))

    # look for base_id for a given "edition"
    base_id = es_config["editions"][edition].get("airtable_id")
    table_name = es_config["editions"][edition].get("table_name")
    if base_id is None:
        print("Seems like there is no Airtable set up, only a CSV file")
        return
    else:
        table = Table(api_key=airtable_key, base_id=base_id, table_name=table_name)
        r = table.create(submission) # create submission
        print(f"Set the record {r['id']} on Airtable")
        return


@app.put("/api/abstract/{edition}/{submission_id}")
async def update_abstract(submission_id: str, submission: Submission, edition: str):
    """
    Update an abstract on Airtable with a given submission ID
    """
    # look for base_id for a given "edition"
    base_id = es_config["editions"][edition].get("airtable_id")
    table_name = es_config["editions"][edition].get("table_name")
    if base_id is None:
        print("Seems like there is no Airtable set up, only a CSV file")
        return
    else:
        table = Table(api_key=airtable_key, base_id=base_id, table_name=table_name)
        r = table.update(submission_id, submission) # create submission
        print(f"Set the record {r['id']} on Airtable")
        return


@app.patch("/api/abstract/")
async def update_user_votes(headers, vote: Vote):
    """
    Update votes made in abstract browser
    to Firebase
    """
    # TODOs: set preference on Firebase
    user_info = get_user_info(headers)
    user_id = user_info.get("user_id")
    vote = vote.dict()  # receive vote
    edition = vote["edition"]
    user_preference = get_data(user_id, preference_collection)  # all preferences

    if vote.get("action") == "like" and user_id is not None:
        if user_preference is None:
            user_preference = {edition: [vote["submission_id"]]}
        else:
            current_pref = user_preference[edition]
            update_pref = list(set(current_pref + [vote["submission_id"]]))
            user_preference.update({edition: update_pref})
        try:
            set_data(user_preference, user_id)
        except (google.cloud.exceptions.NotFound, TypeError):
            return
    elif vote.get("action") == "dislike" and user_id is not None:
        if user_preference is None:
            return
        else:
            current_pref = user_preference[edition]
            update_pref = list(set(current_pref - [vote["submission_id"]]))
            user_preference.update({edition: update_pref})
        try:
            set_data(user_preference, user_id)
        except (google.cloud.exceptions.NotFound, TypeError):
            return
    else:
        return
