import os
import os.path as op
import json
import yaml
from glob import glob
from tqdm.auto import tqdm
from typing import List, Dict, Optional
from dotenv import load_dotenv
load_dotenv(dotenv_path='.backend.env') # setting all credentials here

# import utils as a library
import utils

from datetime import datetime
from dateutil.parser import parse
from pytz import timezone

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
    """Query affiliation from ElasticSearch

    API
    ===
    >>> http://localhost:8000/api/affiliation?q=University%20of%20Pennsylvania
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
    view: Optional[str] = None,
    skip: int = 0,
    limit: int = 40
):
    """
    Query abstracts from a given edition

    edition: str, such as 2020-1, 2020-2, 2020-3
    q: Optional[str], query string
    view: Optional[str], can be "default" | "your-votes" | "recommendations" | "personalized"
    """
    total_submission = Search(using=es, index=f"agenda-{edition}").count()
    page_size = limit # set page size to equal to limit
    current_page = int(skip / page_size) + 1
    total_page = int(total_submission / page_size) + 1

    if q is None and skip is None and limit is None:
        n_results = Search(using=es, index=edition).count()
        queries = utils.query_abstracts(q, n_results=n_results, index=f"agenda-{edition}")
        return JSONResponse(content={"data": queries})
    elif isinstance(q, str) and skip is None and limit is None:
        queries = utils.query_abstracts(q, index=f"agenda-{edition}")
    else:
        queries = []
    
    return JSONResponse(
        content={
            "meta": {
                "currentPage": current_page,
                "totalPage": total_page,
                "pageSize": page_size
            },
            "data": queries
        }
    )


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


