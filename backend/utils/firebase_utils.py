"""
Utilities for Firebase
"""
from typing import Optional
from fastapi import status, Header
from fastapi.responses import JSONResponse

import google.cloud
from google.cloud import firestore
from google.oauth2 import id_token
from google.auth.transport.requests import Request

from dotenv import load_dotenv
load_dotenv(dotenv_path='.backend.env')

db = firestore.Client()
HTTP_REQUEST = Request()


def get_user_info(authorization: Optional[str] = None):
    """
    Get user information from request token
    sending from the frontend
    """
    try:
        token = authorization.replace("Bearer ", "")
        user_info = id_token.verify_firebase_token(token, HTTP_REQUEST)
        return user_info
    except (ValueError, AttributeError) as e:
        return None


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


def get_data(doc_id: str, collection: str):
    """Get data with ``doc_id`` from a given Firebase collection"""
    doc_ref = db.collection(collection).document(doc_id)
    try:
        doc = doc_ref.get().to_dict()
    except google.cloud.exceptions.NotFound:
        doc = None
        print(f"No user with id = {doc_id}!")
    return doc


def set_data(data: dict, doc_id: Optional[str] = None, collection: str = ""):
    """Set data (as a dictionary) to a given Firebase collection"""
    if collection == "":
        return
    if doc_id is None:
        if data.get("id") is not None:
            doc_id = data.get("id")
        else:
            doc_id = data.get("email")
    doc_ref = db.collection(collection).document(doc_id)
    doc_ref.set(data)
    print(f"Set a record with {doc_id} to collection {collection}")


def update_data(data: dict, doc_id: Optional[str] = None, collection: str = ""):
    """Update data to a given Firebase collection"""
    if collection == "":
        return
    if doc_id is None:
        if data.get("id") is not None:
            doc_id = data.get("id")
        else:
            doc_id = data.get("email")
    doc_ref = db.collection(collection).document(doc_id)
    doc_ref.update(data)
    print(f"Set a record with {doc_id} to collection {collection}")
