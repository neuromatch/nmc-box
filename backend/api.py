import os
import os.path as op
import json
from stripe.api_resources import payment_intent
import yaml
from glob import glob
from typing import Optional
from dotenv import load_dotenv
import sendgrid  # sendgrid API
from sendgrid.helpers.mail import *
import stripe

load_dotenv(dotenv_path="../.env")  # setting all credentials here
assert os.environ.get(
    "GOOGLE_APPLICATION_CREDENTIALS"
), "Please check if GOOGLE_APPLICATION_CREDENTIALS is specified in environment file"
assert os.environ.get(
    "AIRTABLE_KEY"
), "Please check if AIRTABLE_KEY is specified in environment file"
SENDGRID_API = os.environ.get("SENDGRID_API_KEY", "You did not specify Sendgrid API")
if not SENDGRID_API:
    print(
        "You do not specify SENDGRID_API_KEY, we will not send email to user after \
        registration and submission"
    )

STRIPE_API_KEY = os.environ.get("STRIPE_SECRET_KEY")
if STRIPE_API_KEY:
    stripe.api_key = STRIPE_API_KEY

import joblib
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
import pandas as pd
from pydantic import BaseModel
from pyairtable import Table
import utils  # import utils as a library, make sure to load environment variables before
from utils import get_user_info, get_data, set_data, update_data, get_agenda

from fastapi import FastAPI, Query, Header, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import google.cloud
from google.oauth2 import id_token
from google.auth.transport.requests import Request

# get Firebase collections
with open("../sitedata/config.yml") as f:
    site_config = yaml.load(f, Loader=yaml.FullLoader)
with open("../scripts/es_config.yml") as f:
    es_config = yaml.load(f, Loader=yaml.FullLoader)

current_edition = site_config["current_edition"]
collections = site_config["firebase-collection"][current_edition]
user_collection = collections["users"]
preference_collection = collections["preferences"]

es = Elasticsearch([{"host": es_config["host"], "port": es_config["port"]}])

# loading model and embeddings
model_paths = glob("../sitedata/embeddings/*.joblib")
embedding_paths = glob("../sitedata/embeddings/*.json")
if len(model_paths) > 0:
    nbrs_models = {
        op.basename(path).split(".")[0]: joblib.load(path) for path in model_paths
    }
if len(embedding_paths) > 0:
    embeddings = {
        op.basename(path).split(".")[0]: json.load(open(path, "r"))
        for path in embedding_paths
    }
airtable_key = os.environ.get("AIRTABLE_KEY")
# map between "edition" and "filter_accepted", default as False
FILTER_ACCEPTED = {
    k: v.get("filter_accepted", False) for k, v in es_config["editions"].items()
}


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:4000",
        "http://localhost:9200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
HTTP_REQUEST = Request()


class Submission(BaseModel):
    # fields provided by users
    title: str = ""
    abstract: str = ""
    firstname: str = ""
    lastname: str = ""
    email: str = ""
    coauthors: Optional[str] = None
    institution: Optional[str] = None
    talk_format: Optional[str] = None
    arxiv: Optional[str] = None  # link to arXiv
    available_dt: Optional[str] = None  # available datetime in UTC separated by ;
    # fields created by organizers for the conference
    starttime: Optional[str] = None
    endtime: Optional[str] = None
    url: Optional[str] = None
    track: Optional[str] = None
    # assume options from ["Accepted", "Rejected", "Waived", "Duplicated"]
    submission_status: Optional[str] = None


class Vote(BaseModel):
    action: str = None


class PaymentPayload(BaseModel):
    currency: str = "USD"
    amount: int = 1500
    client_secret: str = None


# profile
@app.get("/api/affiliation")
async def get_affiliations(
    q: Optional[str] = Query(None), n_results: Optional[int] = Query(10)
):
    """Query affiliation listed in GRID database from ElasticSearch"""
    if n_results is None:
        n_results = 10
    if q is not None:
        queries = utils.query_affiliations(q, n_results=n_results)
    else:
        queries = []
    return JSONResponse(content={"data": queries})


@app.post("/api/confirmation/{email_type}")
async def send_confirmation_email(
    email_type: str = "registration", authorization: Optional[str] = Header(None)
):
    """
    Sending confirmation email using SendGrid API. This API will
    read email template in /sitedata/email-content.json and then
    send it out using SendGrid API

    email_type: str, can be one options from registration, submission, mindmatch
        Add more email template on sitedata/email-content.json
    """
    if SENDGRID_API:
        user_info = get_user_info(authorization)
        email = user_info.get("email")
        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API)

        email_content = json.load(open("../sitedata/email-content.json", "r"))
        data = email_content.get(email_type)
        for d in data["personalizations"]:
            d.update({"to": [{"email": email}]})
        response = sg.client.mail.send.post(request_body=data)
        return JSONResponse(status_code=response.status_code)
    else:
        return None


@app.post("/api/migration")
async def migrate(authorization: Optional[str] = Header(None)):
    # TODOs: find previous user profile and migrate to the current one
    return None


@app.get("/api/user")
async def get_user(authorization: Optional[str] = Header(None)):
    """
    From a given authorization, get user ID, and
    get user data from Firebase
    """
    user_info = get_user_info(authorization)
    if user_info is not None:
        user_id = user_info.get("user_id")
        user = get_data(user_id, user_collection)
        if user is not None:
            return JSONResponse(content={"data": user})
        else:
            return JSONResponse(content={"data": {}})
    else:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)


@app.post("/api/user")
async def create_user(
    user_data: Optional[dict], authorization: Optional[str] = Header(None)
):
    """
    Create user on Firebase for a given user data.
    Structure of the user data from front-end is as follows
        {"id": ..., "payload": ...}
    """
    user_info = get_user_info(authorization)
    if user_info is not None:
        user_id = user_info.get("user_id")
        set_data(user_data["payload"], user_id, user_collection)  # set data
        print(f"Done setting user with ID = {user_id}")
    else:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)


@app.put("/api/user")
async def update_user(
    user_data: Optional[dict], authorization: Optional[str] = Header(None)
):
    """
    Update user on Firebase collection for a given user data.
    """
    user_info = get_user_info(authorization)
    if user_info is not None:
        user_id = user_info.get("user_id")
        update_data(user_data["payload"], user_id, user_collection)  # update data
        print(f"Done setting user with ID = {user_id}")
    else:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)


@app.get("/api/user/preference/")
async def get_user_votes(authorization: Optional[str] = Header(None)):
    """
    Get user votes for all conference editions.
    """
    user_info = get_user_info(authorization)
    if user_info is not None:
        user_id = user_info.get("user_id")
        user_preference = get_data(user_id, preference_collection)  # all preferences
        if user_preference is None:
            user_preference = []
        return JSONResponse(content={"data": user_preference})
    else:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)


@app.get("/api/user/preference/{edition}")
async def get_user_votes(edition: str, authorization: Optional[str] = Header(None)):
    """
    Get user votes from a specific edition.
    """
    user_info = get_user_info(authorization)
    if user_info is not None:
        user_id = user_info.get("user_id")
        user_preference = get_data(user_id, preference_collection)  # all preferences

        if user_preference is not None:
            ids = user_preference.get(edition, [])
            if len(ids) > 0:
                abstracts = ids
            else:
                abstracts = []
        else:
            abstracts = []
        return JSONResponse(content={"data": abstracts})
    else:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)


@app.patch("/api/user/preference/{edition}/{submission_id}")
async def update_user_votes(
    edition: str,
    submission_id: str,
    action: Vote,
    authorization: Optional[str] = Header(None),
):
    """
    Update votes made by user in an abstract browser to Firebase

    edition: str
    submission_id: str
    action: Vote, string can be "like" or "dislike"
    """
    # TODOs: set preference on Firebase
    user_info = get_user_info(authorization)
    if user_info is None:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user_info.get("user_id")
    user_preference = get_data(user_id, preference_collection)  # all preferences

    action = action.dict()["action"]

    if action == "like" and user_id is not None:
        if user_preference is None:
            user_preference = {edition: [submission_id]}
            try:
                set_data(user_preference, user_id, preference_collection)
            except (google.cloud.exceptions.NotFound, TypeError):
                return JSONResponse(status_code=status.HTTP_404_NOT_FOUND)
        else:
            current_pref = user_preference.get(edition, [])
            update_pref = list(set([*current_pref, submission_id]))
            if len(update_pref) > 0:
                try:
                    update_data({edition: update_pref}, user_id, preference_collection)
                except (google.cloud.exceptions.NotFound, TypeError):
                    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND)
            else:
                pass
    elif action == "dislike" and user_id is not None:
        if user_preference is None:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND)
        else:
            current_pref = user_preference.get(edition, [])
            update_pref = list(set(current_pref) - set([submission_id]))
            user_preference.update({edition: update_pref})
            try:
                update_data(user_preference, user_id, preference_collection)
            except (google.cloud.exceptions.NotFound, TypeError):
                return JSONResponse(status_code=status.HTTP_404_NOT_FOUND)
    else:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST)


def query_params_builder(
    current_page: Optional[int] = None, total_pages: Optional[int] = None
):
    """
    Create query argument from a given base_endpoint
    """

    def builder(
        base_endpoint: str, kvs: Optional[tuple] = None,
    ):
        if current_page is not None and total_pages is not None:
            if current_page >= total_pages:
                return None

        if kvs is not None:
            for (k, v) in kvs:
                if v is not None:
                    separator = "?" if "?" not in base_endpoint else "&"
                    base_endpoint += f"{separator}{k}={v}"
        return base_endpoint

    return builder


# abstract search
@app.get("/api/agenda/{edition}")
async def get_agenda(edition: str, starttime: Optional[str] = None):
    """
    Returns agenda one day after a given starttime from a given index

    edition: str, conference edition such as 2020-1, 2020-2, 2020-3
    starttime: str, string of starttime in UTC format such as
        2020-10-26 10:00:00, 2020-10-26 10:00:00+00:00
    """
    if starttime is not None:
        abstracts = utils.get_agenda(index=f"agenda-{edition}", starttime=starttime)
    else:
        abstracts = []

    return JSONResponse(content={"data": abstracts})


# abstract search
@app.get("/api/abstract/{edition}")
async def get_abstracts(
    edition: str,
    q: Optional[str] = Query(None),
    view: Optional[str] = Query("default"),
    starttime: Optional[str] = Query(None),
    endtime: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(40),
    authorization: Optional[str] = Header(None),
):
    """
    Query abstracts from a given edition

    edition: str, such as 2020-1, 2020-2, 2020-3
    q: Optional[str], query string
    view: Optional[str], can be "default" | "your-votes" | "recommendations" | "personalized"
    starttime: str, starttime parameter
    endtime: str, endtime parameter
    skip: int = 0, skip parameter
    limit: int = 40, limit parameter
    """
    # get preference from Firebase
    try:
        user_info = get_user_info(authorization)
        user_id = user_info.get("user_id")
        user_preference = get_data(user_id, preference_collection).get(
            edition, []
        )  # all preferences
    except:
        user_preference = []

    es_search = Search(using=es, index=f"agenda-{edition}")
    n_submissions = es_search.count()
    page_size = limit  # set page size to equal to limit
    current_page = int(skip / page_size) + 1
    n_page = int(n_submissions / page_size) + 1
    if starttime is not None and endtime is not None:
        starttime = utils.convert_utc(starttime)
        endtime = utils.convert_utc(endtime)

    if current_page > n_page:
        return JSONResponse(
            content={
                "meta": {
                    "currentPage": current_page,
                    "totalPage": n_page,
                    "pageSize": page_size,
                },
                "data": [],
            }
        )

    if view == "default":
        submissions = utils.query_abstracts(
            q, index=f"agenda-{edition}"
        )  # get all responses
        submissions = utils.filter_startend_time(
            submissions, starttime, endtime
        )  # filter by start, end time
        return JSONResponse(
            content={
                "meta": {
                    "currentPage": current_page,
                    "totalPage": n_page,
                    "pageSize": page_size,
                },
                "links": {
                    "current": query_params_builder()(
                        f"/api/abstract/{edition}",
                        [
                            ("view", view),
                            ("query", q),
                            ("starttime", starttime),
                            ("endtime", endtime),
                            ("skip", skip),
                            ("limit", page_size),
                        ],
                    ),
                    "next": query_params_builder(current_page, n_page)(
                        f"/api/abstract/{edition}",
                        [
                            ("view", view),
                            ("query", q),
                            ("starttime", starttime),
                            ("endtime", endtime),
                            ("skip", skip + page_size),
                            ("limit", page_size),
                        ],
                    ),
                },
                "data": submissions[skip : skip + limit],
            }
        )
    elif view == "your-votes":
        # Get preference from Firebase and return to frontend
        submission_ids = user_preference
        submissions = [
            utils.get_abstract(index=f"agenda-{edition}", id=idx)
            for idx in submission_ids
        ]
        return JSONResponse(
            content={
                "meta": {
                    "currentPage": int(skip / page_size) + 1,
                    "totalPage": int(len(submissions) / page_size) + 1,
                    "pageSize": page_size,
                },
                "links": {
                    "current": query_params_builder()(
                        f"/api/abstract/{edition}",
                        [("view", view), ("skip", skip), ("limit", page_size),],
                    ),
                    "next": query_params_builder(current_page, n_page)(
                        f"/api/abstract/{edition}",
                        [
                            ("view", view),
                            ("skip", skip + page_size),
                            ("limit", page_size),
                        ],
                    ),
                },
                "data": submissions[skip : skip + limit]
                if len(submissions) > 0
                else [],
            }
        )
    elif view == "recommendations":
        # TODOs: get votes for generating recommendations
        submission_ids = user_preference
        try:
            submissions = utils.generate_recommendations(
                submission_ids,
                data=embeddings,
                index=f"agenda-{edition}",
                nbrs_model=nbrs_models[f"agenda-{edition}"],
                exploration=False,
                abstract_info=True,
            )
        except:
            submissions = []
        submissions = utils.filter_startend_time(submissions, starttime, endtime)
        return JSONResponse(
            content={
                "meta": {
                    "currentPage": int(skip / page_size) + 1,
                    "totalPage": int(len(submissions) / page_size) + 1,
                    "pageSize": page_size,
                },
                "links": {
                    "current": query_params_builder()(
                        f"/api/abstract/{edition}",
                        [
                            ("view", view),
                            ("starttime", starttime),
                            ("endtime", endtime),
                            ("skip", skip),
                            ("limit", page_size),
                        ],
                    ),
                    "next": query_params_builder(current_page, n_page)(
                        f"/api/abstract/{edition}",
                        [
                            ("view", view),
                            ("starttime", starttime),
                            ("endtime", endtime),
                            ("skip", skip + page_size),
                            ("limit", page_size),
                        ],
                    ),
                },
                "data": submissions[skip : skip + limit]
                if len(submissions) > 0
                else [],
            }
        )
    elif view == "personalized":
        # TODOs: get votes for generating personalized recommendation
        submission_ids = user_preference
        submissions = utils.generate_personalized_recommendations(
            submission_ids,
            data=embeddings,
            index=f"agenda-{edition}",
            nbrs_model=nbrs_models[f"agenda-{edition}"],
        )
        submissions = utils.filter_startend_time(submissions, starttime, endtime)
        return JSONResponse(
            content={
                "meta": {
                    "currentPage": int(skip / page_size) + 1,
                    "totalPage": int(len(submissions) / page_size) + 1,
                    "pageSize": page_size,
                },
                "links": {
                    "current": query_params_builder()(
                        f"/api/abstract/{edition}",
                        [
                            ("view", view),
                            ("starttime", starttime),
                            ("endtime", endtime),
                            ("skip", skip),
                            ("limit", page_size),
                        ],
                    ),
                    "next": query_params_builder(current_page, n_page)(
                        f"/api/abstract/{edition}",
                        [
                            ("view", view),
                            ("starttime", starttime),
                            ("endtime", endtime),
                            ("skip", skip + page_size),
                            ("limit", page_size),
                        ],
                    ),
                },
                "data": submissions[skip : skip + limit]
                if len(submissions) > 0
                else [],
            }
        )
    else:
        return JSONResponse(
            content={
                "meta": {
                    "currentPage": current_page,
                    "totalPage": n_page,
                    "pageSize": page_size,
                },
                "links": {
                    "current": query_params_builder()(
                        f"/api/abstract/{edition}",
                        [("view", "default"), ("skip", skip), ("limit", page_size),],
                    ),
                    "next": query_params_builder(current_page, n_page)(
                        f"/api/abstract/{edition}",
                        [
                            ("view", "default"),
                            ("skip", skip + page_size),
                            ("limit", page_size),
                        ],
                    ),
                },
                "data": [],
            }
        )


# abstract get, create, and update
@app.get("/api/abstract/{edition}/{submission_id}")
async def get_abstract(edition: str, submission_id: str):
    """
    Get an abstract with submission id from a given edition.

    Note: This will retrieve from ElasticSearch in case Airtable
        is not specified in es_config
    """
    base_id = es_config["editions"][edition].get("airtable_id")
    table_name = es_config["editions"][edition].get("table_name")
    if base_id is None:
        # query from Elasticsearch
        abstract = utils.get_abstract(index=f"agenda-{edition}", id=submission_id)
    else:
        # query from Airtable
        table = Table(api_key=airtable_key, base_id=base_id, table_name=table_name)
        abstract = table.get(submission_id).get(
            "fields", {}
        )  # return abstract from Airtable
    if abstract is None:
        abstract = {}
    return JSONResponse(content={"data": abstract})


@app.post("/api/abstract/{edition}")
async def create_abstract(
    submission: Submission, edition: str, authorization: Optional[str] = Header(None)
):
    """
    Submit an abstract to Airtable
    """
    submission = submission.dict()
    user_info = get_user_info(authorization)
    user_id = get_user_info(authorization).get("user_id")
    if user_id is not None:
        user = get_data(user_id, user_collection)
        submission["firstname"] = user.get("firstname", "")
        submission["lastname"] = user.get("lastname", "")

    # look for base_id for a given "edition"
    base_id = es_config["editions"][edition].get("airtable_id")
    table_name = es_config["editions"][edition].get("table_name")
    if base_id is None:
        print("Seems like there is no Airtable set up, only a CSV file")
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        table = Table(api_key=airtable_key, base_id=base_id, table_name=table_name)
        r = table.create(submission)  # create submission on Airtable
        print(f"Set the record {r['id']} on Airtable")

        # update submission_id to user on Firebase
        if user_info is not None:
            user_id = user_info.get("user_id")
            update_data(
                {"submission_id": r["id"]}, user_id, user_collection
            )  # update submission id to a user on Firebase
            return JSONResponse(status_code=status.HTTP_200_OK)
        else:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)


@app.put("/api/abstract/{edition}/{submission_id}")
async def update_abstract(
    submission_id: str,
    submission: Submission,
    edition: str,
    authorization: Optional[str] = Header(None),
):
    """
    Update an abstract on Airtable with a given submission ID
    """
    # only allow some keys to be updated by the presenter
    submission = submission.dict()
    user_info = get_user_info(authorization)
    user_id = user_info.get("user_id")
    print("Usedr Info: ", user_info)
    print("User ID: ", user_id)
    if user_id is not None:
        user = get_data(user_id, user_collection)
        print(user)
        submission["firstname"] = user.get("firstname", "")
        submission["lastname"] = user.get("lastname", "")
    print(submission)
    submission = {
        k: v
        for k, v in submission.items()
        if k
        in [
            "title",
            "abstract",
            "firstname",
            "lastname",
            "email",
            "coauthors",
            "institution",
            "talk_format",
            "arxiv",
            "available_dt",
        ]
    }

    # look for base_id for a given "edition"
    base_id = es_config["editions"][edition].get("airtable_id")
    table_name = es_config["editions"][edition].get("table_name")
    if base_id is None:
        print("Seems like there is no Airtable set up, only a CSV file")
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        table = Table(api_key=airtable_key, base_id=base_id, table_name=table_name)
        r = table.update(submission_id, submission)  # update submission
        print(f"Set the record {r['id']} on Airtable")
        return JSONResponse(status_code=status.HTTP_200_OK)


@app.get("/api/school/schedule")
async def get_school_schedule(
    edition: str = "2021-4", authorization: Optional[str] = Header(None),
):
    """
    Returns school agenda from Airtable. Current function only
    return an edition 2021-1 since we made just for ACML 2021.
    """
    user_info = get_user_info(authorization)
    if user_info is not None:
        table = Table(
            airtable_key, es_config["editions"][edition]["airtable_id"], "school"
        )
        submissions = [r.get("fields") for r in table.all() if len(r.get("fields")) > 0]
    else:
        submissions = []
    return JSONResponse(content={"data": submissions})


@app.post("/api/payment/{option}")
async def update_payment(
    option: str = "check",
    payload: PaymentPayload = None,
    authorization: Optional[str] = Header(None),
):
    """
    API for Stripe payment
    """
    collection = "payment"  # Firebase collection
    amount_options = [500, 1000, 1500, 2000, 2500, 3000]
    if payload is None:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)
    payload = payload.dict()
    amount = payload.get("amount", 1500)
    currency = payload.get("USD", "USD")
    if amount not in amount_options:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED)

    user_info = get_user_info(authorization)
    user_id = user_info.get("user_id")

    if option == "check":
        ref = get_data(user_id, collection)
        if ref is None:
            ref = {"payment_status": "wait", "amount": amount}
        return JSONResponse(content=ref)

    elif option == "create":
        # create payment intent using Stripe API
        amount = int(amount) if str(amount).isdigit() else amount
        try:
            session = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                payment_method_types=["card"],
                receipt_email=user_info["email"],
                metadata={"integration_check": "accept_a_payment"},
            )
            payment = {
                "payment_status": "wait",
                "payment_intent_id": session["id"],
                "amount": amount,
            }
            set_data(
                payment, user_id, "payment",
            )  # create payment
            return JSONResponse(content={"client_secret": session["client_secret"]})
        except Exception as e:
            print(e)
            return JSONResponse(content={})

    elif option == "set":
        # set the payment if payment is successful
        payment_dict = get_data(user_id, "payment")
        payment_intent_id = payment_dict["payment_intent_id"]
        client_secret = payload["client_secret"]

        # mismatch intent ID
        if str(payment_intent_id) not in str(client_secret):
            raise JSONResponse(status_code=status.HTTP_400_BAD_REQUEST)

        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if payment_intent.status != "succeeded":
            return JSONResponse(
                content={
                    "error": True,
                    "message": "Sorry, your payment was not successful. Please try again or contact us.",
                }
            )

        # set payment to Firebase
        set_data(
            {
                "payment_status": "paid",
                "payment_intent_id": payment_intent_id,
                "currency": currency,
                "amount": amount,
                "raw_payment_intent": payment_intent,
            },
            user_id,
            collection,
        )
        return JSONResponse(
            content={"message": "Your payment was successful!",},
            status_code=status.HTTP_200_OK,
        )

    elif option == "waive":
        # set payment as waived
        set_data(
            {"payment_status": "waived", "amount": 0, "currency": "USD"},
            user_id,
            collection,
        )
        return JSONResponse(
            content={"message": "You payment has been waived.",},
            status_code=status.HTTP_200_OK,
        )
    else:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND)
