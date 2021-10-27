"""
Elasticsearch ingestion

Usage:
    python elasticsearch.py
"""
import os
import base64
from pytz import timezone
import yaml
from tqdm.auto import tqdm
import numpy as np
import pandas as pd
from pyairtable import Table
from elasticsearch import Elasticsearch, helpers
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")  # setting all credentials here
assert os.environ.get(
    "AIRTABLE_KEY"
), "Please check if AIRTABLE_KEY is specified in environment file"
airtable_key = os.environ.get("AIRTABLE_KEY")

with open("es_config.yml") as f:
    es_config = yaml.load(f, Loader=yaml.FullLoader)

es = Elasticsearch([{"host": es_config["host"], "port": es_config["port"]}])
MAGIC_NUMBER = 9

keys_airtable = [
    "submission_id",
    "title",
    "abstract",
    "fullname",
    "coauthors",
    "institution",
    "theme",
    "talk_format",
    "starttime",
    "endtime",
    "url",
    "track",
    "arxiv",
]  # keys that we are interested from Airtable

# all keys related to URL
keys_url = ["url", "zoom_url", "youtube_url", "crowdcast_url"]

settings_affiliation = {
    "settings": {
        "index": {
            "analysis": {
                "filter": {},
                "analyzer": {
                    "analyzer_keyword": {"tokenizer": "keyword", "filter": "lowercase"},
                    "edge_ngram_analyzer": {
                        "filter": ["lowercase"],
                        "tokenizer": "edge_ngram_tokenizer",
                    },
                },
                "tokenizer": {
                    "edge_ngram_tokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 2,
                        "max_gram": 5,
                        "token_chars": ["letter"],
                    }
                },
            }
        }
    },
    "mappings": {
        "affiliation": {
            "properties": {
                "ID": {"type": "text"},
                "Name": {"type": "text", "analyzer": "edge_ngram_analyzer"},
                "City": {"type": "text", "analyzer": "edge_ngram_analyzer"},
                "State": {"type": "text", "analyzer": "edge_ngram_analyzer"},
                "Country": {"type": "text", "analyzer": "edge_ngram_analyzer"},
            }
        }
    },
}

settings_submission = {
    "settings": {
        "index": {
            "analysis": {
                "filter": {},
                "analyzer": {
                    "analyzer_keyword": {"tokenizer": "keyword", "filter": "lowercase"},
                    "edge_ngram_analyzer": {
                        "filter": ["lowercase"],
                        "tokenizer": "edge_ngram_tokenizer",
                    },
                },
                "tokenizer": {
                    "edge_ngram_tokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 2,
                        "max_gram": 5,
                        "token_chars": ["letter"],
                    }
                },
            }
        }
    },
    "mappings": {
        "submission": {
            "properties": {
                "submission_id": {"type": "text"},
                "title": {"type": "text", "analyzer": "edge_ngram_analyzer"},
                "abstract": {"type": "text", "analyzer": "edge_ngram_analyzer"},
                "fullname": {"type": "text", "analyzer": "edge_ngram_analyzer"},
                "talk_format": {"type": "text", "analyzer": "edge_ngram_analyzer"},
            }
        }
    },
}


def encode_base64(url: str):
    """
    Encode URL to base64
    """
    url_bytes = url.encode("ascii")
    base64_bytes = base64.b64encode(url_bytes)
    return (base64_bytes[MAGIC_NUMBER:] + base64_bytes[:MAGIC_NUMBER]).decode("utf-8")


def convert_utc(dt: str):
    """Convert datetime in string to UTC"""
    utc = timezone("UTC")
    dt = pd.to_datetime(dt)
    if dt.tzinfo is None:
        dt = utc.localize(dt)
    return dt


def get_url_type(url: str):
    """Get name for a given URL string"""
    url = url.lower()
    if "youtu" in url:
        return "YouTube"
    elif "crowdcast" in url:
        return "Crowdcast"
    elif "zoom" in url:
        return "Zoom"
    elif "meet.google" in url:
        return "Google Meet"
    elif "teams.microsoft" in url:
        return "Microsoft Teams"
    else:
        return None


def generate_urls(row):
    """Generate list of URLS from a given row"""
    urls = []
    for k in keys_url:
        url = row.get(k, "")
        if url.strip() != "":
            name = get_url_type(url)
            urls.append({"name": name, "url": encode_base64(url)})
    return urls


def generate_rows(
    rows: list,
    index: str = "grid",
    row_type: str = "affiliation",
    id: str = "ID",
    keys: list = None,
):
    """
    Generate dictionary to ingest to Elasticsearch.
    """
    for _, row in enumerate(rows):
        if isinstance(keys, list):
            row = {k: v for k, v in row.items() if k in keys and v is not np.nan}
        for k in ["starttime", "endtime"]:
            if row.get(k) is not None or row.get(k) != "":
                try:
                    dt = convert_utc(row.get(k))
                    row[k] = dt.isoformat()
                except:
                    pass
        # generate list of URLs
        urls = generate_urls(row)
        if len(urls) > 0:
            row["urls"] = urls
        row = {k: v for k, v in row.items() if k not in keys_url}  # remove URL keys
        # for submission data, cast submission_id to string
        if "submission_id" in row.keys():
            row["submission_id"] = str(row["submission_id"])
        yield {"_index": index, "_type": row_type, "_id": row[id], "_source": row}


def index_grid():
    """
    Index GRID affiliations to elasticsearch index
    """
    grid_df = pd.read_csv(f"grid-{es_config['grid_version']}/grid.csv").fillna("")
    affiliations = grid_df.to_dict(orient="records")

    es.indices.delete(index=es_config["grid_index"], ignore=[400, 404])

    grid_df = pd.read_csv(f"grid-{es_config['grid_version']}/grid.csv").fillna("")
    affiliations = grid_df.to_dict(orient="records")
    es.indices.create(
        index=es_config["grid_index"], body=settings_affiliation, include_type_name=True
    )
    helpers.bulk(es, generate_rows(affiliations, row_type="affiliation", id="ID"))
    print("Done indexing GRID affiliations")


def read_submissions(
    submissions: list, keys: list = None, filter_accepted: bool = False
):
    """
    Function to process submissions from Airtable.
    If `filter_accepted` is True, check value in `submission_status`
    that it is 'Accecpted'. Otherwise,
    """
    submissions_flatten = []
    for submission in submissions:
        if keys is not None:
            d = {k: v for k, v in submission["fields"].items() if k in keys_airtable}
        else:
            d = submission["fields"]
        d["submission_id"] = submission["id"]
        if filter_accepted:
            # if submission_status is "Accepted", append to list
            if d.get("submission_status") == "Accepted":
                submissions_flatten.append(d)
        else:
            submissions_flatten.append(d)
    return submissions_flatten


def index_submissions():
    """
    Index all submissions listed in a ``es_config.yml`` file
    """
    for edition, v in tqdm(es_config["editions"].items()):
        if "path" in v.keys():
            submission_df = pd.read_csv(v["path"]).fillna("")
            submissions = submission_df.to_dict(orient="records")
        elif "airtable_id" in v.keys():
            # check if filter accepted key is available
            filter_accepted = v.get("filter_accepted", False)
            submissions = Table(airtable_key, v["airtable_id"], v["table_name"]).all()
            submissions = read_submissions(
                submissions, keys=keys_airtable, filter_accepted=filter_accepted
            )
            if len(submissions) == 0 and filter_accepted:
                print(
                    "Seems like there are no accepted submissions yet. Check on Airtable"
                )
        else:
            raise RuntimeError(
                "Please put the path to CSV file or Airtable ID in es_config.yml"
            )
        es.indices.delete(index=v["paper_index"], ignore=[400, 404])
        es.indices.create(
            index=v["paper_index"], body=settings_submission, include_type_name=True
        )
        # if no index, set as True
        if len(submissions) > 0 and v.get("index", True):
            submission_df = pd.DataFrame(submissions)
            submission_df["edition"] = edition
            submissions = submission_df.to_dict(orient="records")
            helpers.bulk(
                es,
                generate_rows(
                    submissions,
                    index=v["paper_index"],
                    row_type="submission",
                    id="submission_id",
                    keys=keys_airtable,
                ),
            )
            print(f'Done indexing {len(submissions)} submissions to {v["paper_index"]}')
        else:
            print(f'Skip indexing submissions to {v["paper_index"]}')


if __name__ == "__main__":
    index_grid()  # index GRID database
    index_submissions()  # index submissions
