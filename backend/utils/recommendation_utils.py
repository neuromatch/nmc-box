"""
Utilities for recommendation
"""
import numpy as np
import pandas as pd
from typing import Optional
from sklearn.neighbors import NearestNeighbors

from elasticsearch import Elasticsearch

np.random.seed(seed=126)  # apply seed for exploration sampling

es = Elasticsearch(
    [
        {"host": "localhost", "port": 9200},
    ]
)


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


def get_abstracts(index: str = "agenda-2020-1", ids: list = []):
    """
    Get multiple abstracts from a given list of submission ids.

    index: str, ElasticSearch index (see es_index.py) for the ElasticSearch name
    ids: list, list of abstract IDs
    """
    # return submission if we find submission ID from elasticsearch
    if len(ids) > 0:
        try:
            out = es.mget(index=index, body={"ids": ids})
            submissions = [r["_source"] for r in out["docs"]]
            return submissions
        except:
            return []
    else:
        return []


def generate_recommendations(
    submission_ids: list,
    data: dict,
    index: str,
    nbrs_model: NearestNeighbors = None,
    exploration: bool = False,
    n_recommend: Optional[int] = None,
    alpha: float = 1.2,
    abstract_info: bool = False,
):
    """
    Generate recommended submissions from a list of submission ids
    (Each ID here is an Airtable ID)

    submission_ids: list, list of IDs that we want to produce recommendation
    data: list,  dictionary of index to embedding data mapping
    index: str, index of embedding data such as "agenda-2020-1", "agenda-2020-2", ...
    nbrs_model: NearestNeighbors, nearest neighbors model
    exploration: bool, if exploration is True, send
    alpha: float, factor multiplying to the preference vector (for Rochhio algorithm)
    abstract_info: bool, if False, returning only indices,
        if True returning full abstracts queried from ElasticSearch

    Example
    =======
    >>> embedding_files = glob("../sitedata/embeddings/*.json")
    >>> data = {op.basename(f).split('.')[0]: json.load(open(f, "r")) for f in embedding_files}
    >>> generate_recommendations([1], data, "agenda-2020-1", nbrs_model, abstract_info=True)
    """
    if len(submission_ids) == 0:
        return []

    idx_mapping = {
        r["submission_id"]: r["embedding"] for r in data[index]
    }  # submission to embedding
    idx_subid_mapping = {
        i: r["submission_id"] for i, r in enumerate(data[index])
    }  # idx to submission
    # only use submissions id that exist in keys
    submission_ids = [sid for sid in submission_ids if sid in idx_mapping.keys()]
    pref_vector = (
        alpha
        * np.mean(
            [
                np.array(idx_mapping.get(sid))
                for sid in submission_ids
                if sid in idx_mapping.keys()
            ],
            axis=0,
        )
        .reshape(-1, 1)
        .T
    )
    distances, indices = nbrs_model.kneighbors(pref_vector)
    indices = indices.ravel()
    distances = distances.ravel()
    # if exploration is True, we will sample with probabilities
    # calculated by the inverse distances
    if exploration:
        w = 1 / (distances + 1e-3)
        probs = w / np.sum(w)
        indices = np.random.choice(indices, size=len(indices), replace=False, p=probs)
    recommend_indices = [
        idx_subid_mapping.get(idx) for idx in indices if idx in idx_subid_mapping.keys()
    ]  # recommendation indices
    if n_recommend:
        recommend_indices = recommend_indices[0 : n_recommend + 1]

    if abstract_info:
        recommend_abstracts = get_abstracts(index, recommend_indices)
        return recommend_abstracts
    else:
        return recommend_indices


def generate_personalized_recommendations(
    submission_ids: list,
    data: list,
    index: str,
    nbrs_model: NearestNeighbors = None,
):
    """
    Generate personalized recommendations
    for a given submission ids, given data, index, and nearest neighbors model

    submission_ids: list, list of IDs that we want to produce recommendation
    data: dict, dictionary of index to embedding data mapping
    index: str, index of embedding data such as "agenda-2020-1", "agenda-2020-2", ...
    nbrs_model: NearestNeighbors, nearest neighbors model

    Example
    =======
    >>> embedding_files = glob("../sitedata/embeddings/*.json")
    >>> data = {op.basename(f).split('.')[0]: json.load(open(f, "r")) for f in embedding_files}
    >>> generate_personalized_recommendations([1], data, "agenda-2020-1", nbrs_model, abstract_info=True)
    """
    if len(submission_ids) == 0:
        return []

    rec_submissions = generate_recommendations(
        submission_ids, data, index, nbrs_model, n_recommend=None, abstract_info=True
    )
    if len(rec_submissions) == 0:
        return []
    rec_submissions_df = pd.DataFrame(rec_submissions)
    rec_submissions_df["starttime_sort"] = pd.to_datetime(rec_submissions_df.starttime)

    # for other events, just recommend the closest event within a given starttime
    selected_ids = list(set(submission_ids))
    selected_df = pd.DataFrame(get_abstracts(index, selected_ids))
    selected_df["starttime_sort"] = pd.to_datetime(selected_df.starttime)
    personalized_rec_df = (
        pd.concat((selected_df, rec_submissions_df), axis=0)
        .groupby("starttime_sort")
        .first()
        .reset_index()
        .sort_values("starttime_sort")
    )
    personalized_abstracts = personalized_rec_df.drop("starttime_sort", axis=1).to_dict(
        orient="records"
    )
    return personalized_abstracts
