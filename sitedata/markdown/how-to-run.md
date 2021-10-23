---
title: "Install and deploy"
slug: "/instructions/how-to-run"
requiredLogin: false
---

Neuromatch Conference (NMC) held multiple virtual conferences during the COVID pandemic.
Each of our conferences has led the way in providing new innovations to the virtual conference space.
Many scientific conferences adopted our pipeline and framework to their own conferences.
However, to date, most organizers have to develop their own tech stack for organizing the virtual conference.
Here, we provide our framework for organizing Neuromatch Conference, Neuromatch Conference in a Box (**NMC Box**).
We hope that other organizers, not limited to neuroscientists, can adapt our code to create their own
virtual conferences in the future.

## Components

NMC Box provides following functionalities:

- Registration and log-in with [Firebase](https://firebase.google.com/)
- Search for institution from [GRID database](https://www.grid.ac/)
- Submission - submit abstracts to Airtable
  - Options to ask presenter available times, talk format, theme
  - Organizers is responsible to generate `track`, `url`, `starttime`, `endtime` on Airtable
- Search and recommendation engine with infinite scroll design
- [Mind matching script](https://github.com/titipata/paper-reviewer-matcher), run separately to produce output matches between registered attendees
- Render for markdown and YAML files
- Multiple edition of conferences. The user can still see abstracts from previous conference editions

## Workflow

### Project Structure

- Scripts: Python scripts to generate embeddings and index submissions to ElasticSearch
- Frontend: implemented using [ReactJS](https://reactjs.org/)
- Backend: implemented using Python [FastAPI](https://fastapi.tiangolo.com/)

### Set up environment

There are multiple steps for setting up the environment. We roughly write down as follows:

- Set up Firebase authentication, Cloud Firestore, and Airtable (see instructions below)
- Install backend dependencies in `backend/requirements.txt`
- Create Airtable base for submission, specify `base_id` in `scripts/es_config.yml`
  and Airtable key in `.env` file.
- Add frontend environment by going to Project settings on Firebase.
  Then go to `General` > `Add app` > add Web App.
  Copy keys to `.env` matches to provided `.env.example` file.
- Download Firebase authentication JSON file in the root of this repository. To download,
  you can go to Project settings on Firebase. Choose `Service accounts` >
  `Firebase Admin SDK` > `Generate new private key` in Python.
- Edit basic information in `sitedata/config.yml` for the page and `scripts/es_config.yml`
  for data to be indexed

### Set up backend

We have to create embeddings and index talks to elastic search before
running the web application.

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
uvicorn api:app --reload  # run on port 8000
```

To serve backend with FastAPI library.

### Set up frontend

Install `Node` (see [NodeSource](https://github.com/nodesource/distributions)) and `Gatsby` (see [here](https://www.npmjs.com/package/gatsby)).
Then run the following scripts in `frontend` folder:

```sh
npm install
gatsby develop && gatsby serve --port 4000
```

## Set up authentication, database, and Airtable

We use Firebase for authentication and Cloud Firestore for storing user data and their preferences (votes).
You can set up authentication and Cloud Firestore on [Firebase](https://firebase.google.com/).
We use Airtable to recieive our submission (submission, follow by review process, filter, show in recommendation).

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

We use [Airtable](https://airtable.com/) to store NMC submissions.
Here, you only have to make sure that form on the website is the same with Airtable
(see fields in `sitedata/agenda/README.md`). Airtable allows organizers to
quicky go through submissions and update information easily.

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
