# Neuromatch Conference in a Box

Making an online conference requires some technologies backbone to run it.
We built [Neuromatch conferences (NMCs)](https://neuromatch.io/conference/)
which allow organizers to automate many aspects of the conference and incorporate
ML algorithms to the workflow. Here, we open-source most of our implementations
at NMC so that online organizers can adapt to make the better online conference
in the future.

## Project Structure

* Scripts: Python scripts to generate embeddings and index submissions to ElasticSearch
* Frontend: implemented using [ReactJS](https://reactjs.org/)
* Backend: implemented using Python [FastAPI](https://fastapi.tiangolo.com/)

## Components

NMC in-a-box provides some functionalities as follows:

* Registration - ask for basic information and available times during the conference
* Submission - submit abstracts to Airtable
  * Ask for available times, talk format, theme
  * Then organizers is responsible to generate `track`, `url`, `starttime`, `endtime` (code or manual)
* Search and recommendation engine with infinite scroll design
* Mind matching script - run separately to produce output matches between registered attendees

## Workflow

### Set up enviroment

There are multiple steps for setting up the environment. We roughly write down as follows:

* Install backend dependencies in `backend/requirements.txt`
* Create Airtable base for submission, specify `base_id` in `scripts/es_config.yml`
  and Airtable key in `.env` file.
* Download Firebase authentication JSON file in the root of `backend`. To download,
  you can go to Project settings on Firebase. Choose `Service accounts` >
  `Firebase Admin SDK` > `Generate new private key` in Python.
* Adapt basic information in `sitedata/config.yml` for the page and `scripts/es_config.yml`
  for data to be indexed
* See below for the instructions to set up Firebase authentication and Cloud Firestore.

### Set up backend APIs

Before running API, we have put the data, create embeddings (used for recommendation),
and index them on ElasticSearch.

* First, put data in `sitedata/agenda/*.csv`
* Change information in `scripts/es_config.yml` where you can put path to CSV files or Airtable ID.

``` sh
python embeddings.py --option=sent_embed # create embedding
bash serve_elasticsearch.sh # serve elasticsearch
python es_index.py # index ElasticSearch
```

* Go to `backend` and serve APIs using

``` sh
uvicorn api:app --reload
```

To serve backend with FastAPI library.

### Set up frontend

(TBA)

## Set up authentication, database, and Airtable

We use Firebase for authentication and Cloud Firestore for storing user data and their preferences (votes).
You can set up authentication and Cloud Firestore on [Firebase](https://firebase.google.com/).
We use Airtable to recieve our submission (submission, follow by review process, filter, show in recommendation).
Here, we list down a general ideas on how to create authentication for the registration.

### Google authentication

* On Firebase: Set up Google sign in

### Github authentication

* On Firebase: Set up Github `Sign-in method`
* On Github: Go to `settings` > `Developer settings` > `Github App` > Get Client ID and Client Secret
* On Firebase: Put Client ID and Client Secret from Github

### Set up Cloud Firestore

As mentioned, we use Cloud Firestore to collect user data and preferences.
To create a database/collection, you can go to `Firestore Database` on Firebase then `+ Start collection`.
We create `users`, `preferences` as a collection name as specified in `sitedata/config.yml`.

### Airtable

For submission, we have a good experience with [Airtable](https://airtable.com/) so we implement
the backend so that the submission is added to Airtable. Here, you only have to make sure that
form on the website is the same with Airtable (see fields on `sitedata/agenda/README.md`).
We set up Airtable base which you can view here (TBD).

## Citations

If you use or refer to NMC workflow, please cite our published articles on
[TICS](https://www.sciencedirect.com/science/article/pii/S1364661321000097) and
[eLife](https://elifesciences.org/articles/57892) below:

```
@article{achakulvisut2021towards,
  title={Towards Democratizing and Automating Online Conferences: Lessons from the Neuromatch Conferences},
  author={Achakulvisut, Titipat and Ruangrong, Tulakan and Mineault, Patrick and Vogels, Tim P and Peters, Megan AK and Poirazi, Panayiota and Rozell, Christopher and Wyble, Brad and Goodman, Dan FM and Kording, Konrad Paul},
  journal={Trends in Cognitive Sciences},
  year={2021},
  publisher={Elsevier}
}
```

```
@article{achakulvisut2020point,
  title={Point of view: Improving on legacy conferences by moving online},
  author={Achakulvisut, Titipat and Ruangrong, Tulakan and Bilgin, Isil and Van Den Bossche, Sofie and Wyble, Brad and Goodman, Dan FM and Kording, Konrad P},
  journal={Elife},
  volume={9},
  pages={e57892},
  year={2020},
  publisher={eLife Sciences Publications Limited}
}
```
