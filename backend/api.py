import os
import os.path as op
import json
import yaml
from glob import glob
from tqdm.auto import tqdm
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

with open("es_config.yml") as f:
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


def firebase_authentication(request, response, context=None, **kwargs):
    """Token authorization for GET and/or POST request.
    This is use to authenticate user for our API.

    The request header looks like the following
    {
        headers: {
            Authorization: 'Bearer <jwt_firebase_token>'
        }
    }
    We can verify Firebase token given from the frontend.

    Usage:
        Adding @hug.get('/<api_name>', requires=firebase_authentication)
        to API that need authentication
    """
    token = request.get_header('Authorization')

    if token:
        if token.split("Bearer ").pop():
            token = token.split("Bearer ").pop()
            try:
                _ = id_token.verify_firebase_token(
                    token, HTTP_REQUEST
                )
                # if claim exists, quit this authentication
                return True
            except ValueError:
                raise HTTPForbidden(
                    "Unauthorized Error",
                    "Unable to determine with provided encoding",
                )
    raise HTTPUnauthorized(
        "Authentication Error",
        "Unable to determine with provided encoding",
    )
