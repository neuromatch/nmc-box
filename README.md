# Neuromatch in a box

Without technology backbone, making a conference is probably hard for many organizers.
In 2020, we built [Neuromatch conferences](https://neuromatch.io/conference/)
which allow organizers to automate many aspects of the conference. Here, we try to
open-source multiple aspects for other organizers.

## Project Structure (TBA)

* Scripts - for generating information
* Frontend using ReactJS
* Backend using Python

## Components

NMC in-a-box provides some functionalities as follows:

* Registration
* Search and recommendation engine
* Mind matching script (run separately to produce output matches between registered attendees)

## Set up authentication

We use Firebase for authentication. Go to [Firebase](https://firebase.google.com/) to create authentication.

### Google authentication

* Set up Google sign in

### Github authentication

* On Firebase: Set up Github `Sign-in method`
* On Github: Go to `settings` > `Developer settings` > `Github App` > Get Client ID and Client Secret
* On Firebase: Put Client ID and Client Secret from Github

## Set up Cloud Firestore

We use Cloud Firestore to collect user data. You can go to `Firestore Database` then `+ Start collection`.
Here we have `users_2021_1` as a collection name.

## Workflow

### Set up enviroment

Setting up `.env` file which contains Airtable key and Firebase authentication.

### Backend

In backend, we have put the data, create embeddings (for recommendation), and index them on ElasticSearch
(use to provide abstract information in the frontend).

* Put data in `sitedata/agenda/*.csv`
* In `scripts` folder, change information in `es_config.yml` where you can put path to CSV files or Airtable ID.

``` sh
python embeddings.py --option=sent_embed # create embedding
bash serve_elasticsearch.sh # serve elasticsearch
python es_index.py # index ElasticSearch
```

* After indexing data to ElasticSearch, go to `backend` and run

``` sh
uvicorn api:app
```

To serve backend with FastAPI library.

### Frontend

(TBA)
