import yaml
from tqdm import tqdm
import pandas as pd
from elasticsearch import Elasticsearch, helpers

with open("../sitedata/server.yml") as f:
    server_config = yaml.load(f, Loader=yaml.FullLoader)

es = Elasticsearch([{
    'host': server_config["host"],
    'port': server_config["port"]
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


def generate_rows(rows, row_type="affiliation", id="ID"):
    for _, row in enumerate(rows):
        yield {
            '_index': server_config["grid_index"],
            '_type': row_type,
            '_id': row[id],
            '_source': row
        }


def index_grid():
    """
    Index GRID affiliations to elasticsearch index
    """
    grid_df = pd.read_csv(server_config["grid_path"]).fillna('')
    affiliations = grid_df.to_dict(orient='records')

    es.indices.delete(
        index=server_config["grid_index"],
        ignore=[400, 404]
    )

    grid_df = pd.read_csv(server_config["grid"]).fillna('')
    affiliations = grid_df.to_dict(orient='records')
    es.indices.create(
        index=server_config["grid_index"],
        body=settings_affiliation,
        include_type_name=True
    )
    helpers.bulk(es, generate_rows(affiliations, row_type="affiliation", id="ID"))
    print('Done indexing GRID affiliations')


def index_submission():
    """Index all submissions listed in server.yml
    """
    for k, v in server_config["editions"].items():
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
        helpers.bulk(es, generate_rows(submissions))
    print('Done indexing submissions')


if __name__ == '__main__':
    # index GRID database
    index_grid()

    # index submissions
    index_submission()
