"""
Utilities for recommendation
"""
import numpy as np
from sklearn.neighbors import NearestNeighbors
from submission_utils import get_abstract
np.random.seed(seed=126)  # apply seed


def generate_recommendations(
    submission_ids: list,
    data: list,
    index: str,
    nbrs_model: NearestNeighbors = None,
    exploration: bool = False,
    n_recommend: int = None,
    alpha: float = 1.2,
    abstract_info: bool = False
):
    """
    Generate recommended submissions from a list of submission ids
    (Each ID here is an Airtable ID)

    submission_ids: list, list of IDs that we want to produce recommendation
    data: list, embedding data
    index: str, index of embedding data such as "2020-1", "2020-2", ...
    nbrs_model: NearestNeighbors, nearest neighbors model
    exploration: bool, if exploration is True, send
    alpha: float, factor multiplying to the preference vector (for Rochhio algorithm)
    abstract_info: bool, if False, returning only indices,
        if True returning full abstracts queried from ElasticSearch
    """
    idx_mapping =  {r["submission_id"]: r["embedding"] for r in data[index]}  # submission to embedding
    idx_subid_mapping = {i: r["submission_id"] for i, r in enumerate(data[index])} # idx to submission
    # only use submissions id that exist in keys
    submission_ids = [
        sid for sid in submission_ids
        if sid in idx_mapping.keys()
    ]
    pref_vector = alpha * np.mean([
        np.array(idx_mapping.get(sid))
        for sid in submission_ids
        if sid in idx_mapping.keys()
    ], axis=0).reshape(-1, 1).T
    distances, indices = nbrs_model.kneighbors(pref_vector)
    indices = indices.ravel()
    distances = distances.ravel()
    # if exploration is True, we will sample with probabilities
    # calculated by the inverse distances
    if exploration:
        w = 1 / (distances + 1e-3)
        probs = w / np.sum(w)
        indices = np.random.choice(
            indices, size=len(indices),
            replace=False, p=probs
        )
    recommend_indices = [
        idx_subid_mapping.get(idx)
        for idx in indices
        if idx in idx_subid_mapping.keys()
    ]  # recommendation indices
    if n_recommend:
        recommend_indices = recommend_indices[0:n_recommend + 1]

    if abstract_info:
        recommend_abstracts  = [get_abstract(index, id=idx) for idx in recommend_indices]
        return recommend_abstracts
    else:
        return recommend_indices