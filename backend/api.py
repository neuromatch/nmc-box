import os
import os.path as open
import json
from tqdm import tqdm

from datetime import datetime
from dateutil.parser import parse
from pytz import timezone

from fastapi import FastAPI, File, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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
