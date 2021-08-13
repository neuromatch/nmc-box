"""
Utilities for Airtable
We will mostly use pyairtable but we implement a few functions to use
"""
import json
import requests


def get_record(
    airtable_key: str, base_id: str,
    table_name: str = "submissions", record_id: str = ""
):
    """
    Get record from Airtable with a given record ID `record_id`
    """
    if record_id != "":
        request_url = (
            f"https://api.airtable.com/v0/{base_id}/{table_name}/{record_id}"
        )
        headers = {
            "Authorization": f"Bearer {airtable_key}",
        }
        output = requests.get(request_url, headers=headers)
        return output
    else:
        return None


def set_record(
    airtable_key: str, base_id: str,
    data: dict, table_name: str = "submissions"
):
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
        "Authorization": f"Bearer {airtable_key}",
        "Content-Type": "application/json",
    }
    post_url = f"https://api.airtable.com/v0/{base_id}/{table_name}"
    output = requests.post(post_url, data=json.dumps(data), headers=headers)
    return output.json()
