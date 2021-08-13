"""
Utilities for submissions
"""
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

es = Elasticsearch([
    {"host": "localhost", "port": 9200},
])
es_search = Search(using=es)


def get_abstract(index: str = "agenda-2020-1", id: str = "1"):
    """
    Get abstract id from a given index.

    index: str, ElasticSearch index (see es_index.py) for the ElasticSearch name
    """
    # return submission if we find submission ID from elasticsearch
    if id != "":
        try:
            submission = es.get(index=index, id=id).get("_source", [])
            return submission
        except:
            return None
    else:
        return None
