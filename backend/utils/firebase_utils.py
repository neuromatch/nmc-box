"""
Utilities for Firebase
"""
import os
import os.path as op
import google.cloud
from google.cloud import firestore, storage

db = firestore.Client()

def get_all_collection(collection: str = "users"):
    """
    Get all collection from the user
    """
    rows = []
    ref = db.collection(collection)
    for doc in ref.stream():
        row = doc.to_dict()
        row["id"] = doc.id
        rows.append(row)
    return rows


def delete_data(doc_id: str, collection: str):
    """
    Delete a record with ``doc_id`` from a given ``collection``
    """
    db.collection(collection).document(doc_id).delete()
    print(f"Deleting {doc_id} from collection {collection}")


def set_data(data: dict, doc_id: str = None, collection: str = ""):
    """Set data (as a dictionary) to Firebase collection"""
    if collection == "":
        return
    if doc_id is None:
        if data.get("id") is not None:
            doc_id = data.get("id")
        else:
            doc_id = data.get("email")
    doc_ref = db.collection(data).document(doc_id)
    doc_ref.set(data)
    print(f"Set a record with {doc_id} to collection {collection}")


def get_data(doc_id: str, collection: str):
    """Get data with ``doc_id`` from a given Firebase collection"""
    doc_ref = db.collection(collection).document(doc_id)
    try:
        doc = doc_ref.get().to_dict()
    except google.cloud.exceptions.NotFound:
        doc = None
        print(f"No user with id = {doc_id}!")
    return doc
