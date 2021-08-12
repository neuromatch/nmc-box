"""
Utilities for Airtable
"""
import os
import json
import requests
import pandas as pd
from urllib.parse import quote
from tqdm import tqdm, tqdm_notebook
from airtable import Airtable

AIRTABLE_ID = os.environ.get("AIRTABLE_ID")
AIRTABLE_KEY = os.environ.get("AIRTABLE_KEY")
assert isinstance(AIRTABLE_ID, str), "Please provide AIRTABLE_ID in .backend.env file"
assert isinstance(AIRTABLE_KEY, str), "Pleaase provide AIRTABLE_KEY in .backend.env file"


def get_record(table_name: str = "submissions", record_id: str = ""):
    """
    Get record from Airtable with a given record ID `record_id`
    """
    if record_id != "":
        request_url = (
            f"https://api.airtable.com/v0/{AIRTABLE_ID}/{table_name}/{record_id}"
        )
        headers = {
            "Authorization": f"Bearer {AIRTABLE_KEY}",
        }
        output = requests.get(request_url, headers=headers)
        return output
    else:
        return None


def set_record(data: dict, table_name: str = "submissions"):
    """
    Add event to Airtable with AIRTABLE_ID
    specified in .env file
    See https://airtable.com/api
    for more details about Airtable APIs
    Note that we have to edit Airtable to have the following fields
    fullname, date, speaker, institution, id (submission_id)
    >>> data = {
        "records": [
          {
            "fields": {
              "title": "How we make neuromatch conference",
              "starttime": "2020-10-01T00:00:00Z",
              "endtime": "2020-10-01T00:00:15Z",
              "fullname": "Titipat A.",
              "institution": "University of Pennsylvania",
              "talk_format": "Short talk",
              "id": "[put ID of the talk here]"
            }
          }
        ]
    }
    >>> output = add_data_airtable(data)
    >>> print(output)
    """
    headers = {
        "Authorization": f"Bearer {AIRTABLE_KEY}",
        "Content-Type": "application/json",
    }
    post_url = f"https://api.airtable.com/v0/{AIRTABLE_ID}/{table_name}"
    output = requests.post(post_url, data=json.dumps(data), headers=headers)
    return output.json()


