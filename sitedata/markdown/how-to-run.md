---
title: "Install and deploy"
slug: "/instructions/how-to-run"
requiredLogin: false
---

Here, we describe project structures, stacks, and how to run NMC Box.

## Project Structure

- Scripts: Python scripts to generate embeddings and index submissions to ElasticSearch
- Frontend: implemented using [ReactJS](https://reactjs.org/)
- Backend: implemented using Python [FastAPI](https://fastapi.tiangolo.com/)

## Components

NMC in-a-box provides some functionalities as follows:

- Registration - ask for basic information and available times during the conference
- Submission - submit abstracts to Airtable
  - Ask for available times, talk format, theme
  - Then organizers is responsible to generate `track`, `url`, `starttime`, `endtime` (code or manual)
- Search and recommendation engine with infinite scroll design
- Mind matching script - run separately to produce output matches between registered attendees

## Workflow

### Set up environment

There are multiple steps for setting up the environment. We roughly write down as follows:

- Install backend dependencies in `backend/requirements.txt`
- Create Airtable base for submission, specify `base_id` in `scripts/es_config.yml`
  and Airtable key in `.env` file.
- Add frontend environment by going to Project settings on Firebase.
  Then go to `General` > `Add app` > add Web App.
  Copy keys to `.env` matches to provided `.env.example` file.
- Download Firebase authentication JSON file in the root of this repository. To download,
  you can go to Project settings on Firebase. Choose `Service accounts` >
  `Firebase Admin SDK` > `Generate new private key` in Python.
- Adapt basic information in `sitedata/config.yml` for the page and `scripts/es_config.yml`
  for data to be indexed
- See below for the instructions to set up Firebase authentication and Cloud Firestore.

### Set up backend APIs

Before running API, we have put the data, create embeddings (used for recommendation),
and index them on ElasticSearch.

- First, put data in `sitedata/agenda/*.csv`
- Change information in `scripts/es_config.yml` where you can put path to CSV files or Airtable ID
- Create embedding with `embeddings.py` script, you may use `--option=lsa` when you are testing as it is faster and use `--option=sent_embed` in production as it provides better performance

```sh
# run faster
python embeddings.py --option=lsa
# better performance
python embeddings.py --option=sent_embed
```

- Then, serve and index ElasticSearch

```sh
bash es_serve.sh # serve Elasticsearch server
python es_index.py # index
```

- Go to `backend` and serve APIs using

```sh
uvicorn api:app --reload
```

To serve backend with FastAPI library.

### Set up frontend

Download Node and Gatsby. Then run the following scripts in `frontend`:

```sh
npm install
gatsby develop && gatsby serve --port 4000
```

## Set up authentication, database, and Airtable

We use Firebase for authentication and Cloud Firestore for storing user data and their preferences (votes).
You can set up authentication and Cloud Firestore on [Firebase](https://firebase.google.com/).
We use Airtable to receive our submission (submission, follow by review process, filter, show in recommendation).
Here, we list down a general ideas on how to create authentication for the registration.

### Google authentication

- On Firebase: Set up Google sign in

### Github authentication

- On Firebase: Set up Github `Sign-in method`
- On Github: Go to `settings` > `Developer settings` > `Github App` > Get Client ID and Client Secret
- On Firebase: Put Client ID and Client Secret from Github

### Set up Cloud Firestore

As mentioned, we use Cloud Firestore to collect user data and preferences.
To create a database/collection, you can go to `Firestore Database` on Firebase then `+ Start collection`.
We create `users`, `preferences` as a collection name as specified in `sitedata/config.yml`.

### Airtable

For submission, we have a good experience with [Airtable](https://airtable.com/) so we implement
the backend so that the submission is added to Airtable. Here, you only have to make sure that
form on the website is the same with Airtable (see fields on `sitedata/agenda/README.md`).
We set up Airtable base which you can view here (TBD).

## Set up automatic email with SendGrid

We use SendGrid to send email out to our participants. You can create a SendGrid account on
[SendGrid](https://sendgrid.com/). Then, set up email domain in `Settings` > `Sender Authentication`
and `API Keys`. Then add `SENDGRID_API_KEY` to `.env`. We suggest to test the API using
[sendgrid-python](https://github.com/sendgrid/sendgrid-python) before launching the website.
You can specify email content in `sitedata/email-content.json`.

If `SENDGRID_API_KEY` is **not** specified, we will not send an email
after registration and submission.

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
