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

from fastapi import FastAPI, File, UploadFile
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


@app.get("/api/query/{index_name}")
async def query(index_name: str, q: Optional[str] = None, n_results: Optional[int] = 10):
    """Query affiliation and submissions from ElasticSearch

    API
    ===
    >>> http://localhost:8000/api/query/grid?q=University%20of%20Pennsylvania
    """
    if n_results is None:
        n_results = 10
    if index_name == "grid":
        if q is not None:
            queries = utils.query_affiliations(q, n_results=n_results)
        else:
            queries = []
    elif index_name != "":
        queries = utils.query_abstracts(q, n_results=n_results, index=index_name)
    else:
        queries = []
    return {"data": queries}

