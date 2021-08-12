import os
import os.path as op
import json
import yaml
from glob import glob
from tqdm.auto import tqdm
from utils import *

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

# set credential path for Firebase
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = glob(op.join(os.pardir, "devops", "neuromatch-*.json"))[0]
HTTP_REQUEST = Request()

