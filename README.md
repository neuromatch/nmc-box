# Neuromatch Conference in a Box

Without technology backbone, making a conference is probably hard for many organizers.
In 2020, we built [Neuromatch conferences (NMCs)](https://neuromatch.io/conference/)
which allow organizers to automate many aspects of the conference. Here, we try to
open-source most of our implementations so that other organizers can adapt or
use.



## Project Structure (TBA)

* Scripts - for generating information
* Frontend using ReactJS
* Backend using Python

## Components

NMC in-a-box provides some functionalities as follows:

* Registration - ask for basic information and available times during the conference
* Submission - submit abstracts to Airtable
* Search and recommendation engine with infinite scroll design
* Mind matching script - run separately to produce output matches between registered attendees

## Workflow

### Set up enviroment

* Setting up `.env` file which contains Airtable key and Firebase authentication.
* Install backend dependencies in `backend/requirements.txt`

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

## Set up authentication, database, and Airtable

In current NMC, we use Firebase for authentication. Cloud Firestore
You can go to [Firebase](https://firebase.google.com/) to create authentication for your conference website.

### Google authentication

* On Firebase: Set up Google sign in

### Github authentication

* On Firebase: Set up Github `Sign-in method`
* On Github: Go to `settings` > `Developer settings` > `Github App` > Get Client ID and Client Secret
* On Firebase: Put Client ID and Client Secret from Github

### Set up Cloud Firestore

We use Cloud Firestore to collect user data. You can go to `Firestore Database` then `+ Start collection`.
Here we have `users_2021_1` as a collection name.

### Airtable

For submission, we have a good experience with [Airtable](https://airtable.com/) so we implement
the backend so that the submission is added to Airtable. Here, you only have to make sure that
form on the website is the same with Airtable (see fields on `sitedata/agenda/README.md`).
We set up Airtable base which you can view here (TBD).

## Citations

If you use or refer to NMC workflow, please cite our published articles on TICS and eLife

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