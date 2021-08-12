"""
Elasticsearch ingestion

Usage:
    python elasticsearch.py
"""
import yaml
from tqdm.auto import tqdm
import pandas as pd
from elasticsearch import Elasticsearch, helpers

with open("es_config.yml") as f:
    es_config = yaml.load(f, Loader=yaml.FullLoader)

es = Elasticsearch([{
    'host': es_config["host"],
    'port': es_config["port"]
}])

settings_affiliation = {
    "settings": {
        "index": {
            "analysis": {
                "filter": {},
                "analyzer": {
                    "analyzer_keyword": {
                        "tokenizer": "keyword",
                        "filter": "lowercase"
                    },
                    "edge_ngram_analyzer": {
                        "filter": [
                            "lowercase"
                        ],
                        "tokenizer": "edge_ngram_tokenizer"
                    }
                },
                "tokenizer": {
                    "edge_ngram_tokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 2,
                        "max_gram": 5,
                        "token_chars": [
                            "letter"
                        ]
                    }
                }
            }
        }
    },
    "mappings": {
        "affiliation": {
            "properties": {
                "ID": {
                    "type": "text"
                },
                "Name": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                },
                "City": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                },
                "State": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                },
                "Country": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                }
            }
        }
    }
}

settings_submission = {
    "settings": {
        "index": {
            "analysis": {
                "filter": {},
                "analyzer": {
                    "analyzer_keyword": {
                        "tokenizer": "keyword",
                        "filter": "lowercase"
                    },
                    "edge_ngram_analyzer": {
                        "filter": [
                            "lowercase"
                        ],
                        "tokenizer": "edge_ngram_tokenizer"
                    }
                },
                "tokenizer": {
                    "edge_ngram_tokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 2,
                        "max_gram": 5,
                        "token_chars": [
                            "letter"
                        ]
                    }
                }
            }
        }
    },
    "mappings": {
        "submission": {
            "properties": {
                "submission_id": {
                    "type": "text"
                },
                "title": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                },
                "abstract": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                },
                "fullname": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                },
                "talk_format": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                }
            }
        }
    }
}


def generate_rows(rows: list, index: str = "grid", row_type: str = "affiliation", id: str = "ID", keys: list = None):
    """
    Generate dictionary to ingest to Elasticsearch.
    """
    for _, row in enumerate(rows):
        if isinstance(keys, list):
            row = {k: str(v) for k, v in row.items() if k in keys}
        yield {
            '_index': index,
            '_type': row_type,
            '_id': row[id],
            '_source': row
        }


def index_grid():
    """
    Index GRID affiliations to elasticsearch index
    """
    grid_df = pd.read_csv(es_config["grid_path"]).fillna('')
    affiliations = grid_df.to_dict(orient='records')

    es.indices.delete(
        index=es_config["grid_index"],
        ignore=[400, 404]
    )

    grid_df = pd.read_csv(es_config["grid_path"]).fillna('')
    affiliations = grid_df.to_dict(orient='records')
    es.indices.create(
        index=es_config["grid_index"],
        body=settings_affiliation,
        include_type_name=True
    )
    helpers.bulk(es, generate_rows(affiliations, row_type="affiliation", id="ID"))
    print('Done indexing GRID affiliations')


def index_submissions():
    """
    Index all submissions listed in es_config.yml
    """
    for _, v in tqdm(es_config["editions"].items()):
        submission_df = pd.read_csv(v["path"]).fillna("")
        es.indices.delete(
            index=v["paper_index"],
            ignore=[400, 404]
        )
        es.indices.create(
            index=v["paper_index"],
            body=settings_submission,
            include_type_name=True
        )
        submissions = submission_df.to_dict(orient="records")
        helpers.bulk(
            es,
            generate_rows(
                submissions,
                index=v["paper_index"],
                row_type="submission",
                id="submission_id",
            )
        )
        print(f'Done indexing submissions to {v["paper_index"]}')


if __name__ == '__main__':
    index_grid()  # index GRID database
    index_submissions()  # index submissions
