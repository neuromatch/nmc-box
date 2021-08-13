import os
import os.path as op
import json
import yaml
from glob import glob
from typing import List, Dict, Optional
from dotenv import load_dotenv
load_dotenv(dotenv_path='.backend.env') # setting all credentials here

# import utils as a library
import utils

import joblib
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

from fastapi import FastAPI, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from google.oauth2 import id_token
from google.auth.transport.requests import Request
from falcon import HTTPUnauthorized, HTTPForbidden, HTTP_302

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

# profile
@app.get("/api/affiliation")
async def get_affiliations(q: Optional[str] = None, n_results: Optional[int] = 10):
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


# abstract
@app.get("/api/abstract/{edition}")
async def get_abstracts(
    edition: str,
    q: Optional[str] = None,
    view: Optional[str] = "default",
    starttime: Optional[str] = None,
    endtime: Optional[str] = None,
    sort: bool = False,
    skip: int = 0,
    limit: int = 40
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
        responses = utils.query_abstracts(q, index=f"agenda-{edition}") # get all responses
        submissions = utils.filter_startend_time(responses, starttime, endtime) # filter by start, end time

        return JSONResponse(content={
            "meta": {
                "currentPage": current_page,
                "totalPage": n_page,
                "pageSize": page_size
            },
            "links": {
                "current": f"/api/abstract/{edition}?view={view}&query={q}&starttime={starttime}&endtime={endtime}&sort={sort}&skip={skip}&limit={page_size}",
                "next": f"/api/abstract/{edition}?view={view}&query={q}&starttime={starttime}&endtime={endtime}&sort={sort}&skip={skip + page_size}&limit={page_size}"
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
                "current": f"/api/abstract/{edition}/default?view=default&skip={skip}&limit={page_size}",
                "next": f"/api/abstract/{edition}/default?view=default&skip={skip + page_size}&limit={page_size}"
            },
            "data": []
        })


@app.get("/api/abstract/{edition}/{submission_id}")
async def get_abstract(edition: str, submission_id: str):
    """Get an abstract with submission id from a given edition 
    """
    abstract = utils.get_abstract(index=f"agenda-{edition}", id=submission_id)
    return JSONResponse(content={"data": abstract})


@app.post("/api/abstract")
async def set_abstract(edition: str, submission_id: str):
    """Submit an abstract"""
    # TODOs: recieve submission and update Airtable
    return None


@app.patch("/api/abstract/{edition}/{submission_id}")
async def update_preference(edition: str, submission_id: str, action: str = "like"):
    """Update preference"""
    # TODOs: set preference on Firebase
    return None


