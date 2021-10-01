"""
Transform text to embeddings using 
Original code from https://github.com/Mini-Conf/Mini-Conf/blob/master/scripts/embeddings.py

Usage:
    embeddings.py [--option=<option>]
    embeddings.py [-h | --help]
    embeddings.py [-v | --version]

Options:
    -h --help       Show this screen
    --version       Show version
    --option=<option>     Embedding option, can be ``lsa`` or ``sent_embed``, default ``lsa``
"""
import os
import os.path as op
import json
import yaml
from glob import glob
from docopt import docopt
from dotenv import load_dotenv

import joblib
import numpy as np
import pandas as pd
from pyairtable import Table
from tqdm.auto import tqdm
from transformers import AutoTokenizer, AutoModel

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.neighbors import NearestNeighbors

from es_index import read_submissions, keys_airtable

load_dotenv(dotenv_path="../.env")  # setting all credentials here
MAX_BATCH_SIZE = 16
assert os.environ.get(
    "AIRTABLE_KEY"
), "Please check if AIRTABLE_KEY is specified in environment file"
airtable_key = os.environ.get("AIRTABLE_KEY")


def chunks(lst, chunk_size=MAX_BATCH_SIZE):
    """
    Splits a longer list to respect batch size
    ref: https://github.com/allenai/paper-embedding-public-apis
    """
    for i in range(0, len(lst), chunk_size):
        yield lst[i : i + chunk_size]


def preprocess(text):
    """
    Function to preprocess text

    TODOs: use stemming for preprocessing
    """
    return text.lower()


def calculate_embeddings(df, option="lsa", n_papers=MAX_BATCH_SIZE, n_components=30):
    """Calculates embeddings from a given dataframe
    assume dataframe has title and abstract in the columns

    option: str, if ``lsa`` use Latent Semantic Analysis
        if ``sent_embed`` use Specter from AllenAI
    n_papers: int, default 10
        Group papers into smaller list for embedding computations
        Larger one takes too long on regular laptop
    """
    assert option in ["lsa", "sent_embed"]
    if len(df) < n_components:
        print(
            "Length of dataframe is less than number of projected components, \
            set option to sent_embed instead"
        )
        option = "sent_embed"
    if option == "sent_embed":
        print("Download SPECTER model for creating embedding\n")
        tokenizer = AutoTokenizer.from_pretrained("allenai/specter")
        model = AutoModel.from_pretrained("allenai/specter")
        papers = list(df["title"] + "[SEP]" + df["abstract"])
        # group papers
        embeddings = []
        for g in tqdm(chunks(papers, chunk_size=n_papers)):
            inputs = tokenizer(
                g, padding=True, truncation=True, return_tensors="pt", max_length=512
            )
            result = model(**inputs)
            embeddings.extend(result.last_hidden_state[:, 0, :])
        embeddings = [emb.tolist() for emb in embeddings]
        paper_embeddings = [
            {"submission_id": pid, "embedding": embedding}
            for pid, embedding in zip(df.submission_id, embeddings)
        ]
    elif option == "lsa":
        tfidf_model = TfidfVectorizer(
            min_df=3,
            max_df=0.85,
            lowercase=True,
            norm="l2",
            ngram_range=(1, 2),
            use_idf=True,
            smooth_idf=True,
            sublinear_tf=True,
            stop_words="english",
        )
        topic_model = TruncatedSVD(n_components=n_components, algorithm="arpack")
        papers = (df["title"] + " " + df["abstract"]).map(preprocess)
        X_tfidf = tfidf_model.fit_transform(papers)
        X_topic = topic_model.fit_transform(X_tfidf)
        paper_embeddings = [
            {"submission_id": pid, "embedding": list(embedding)}
            for pid, embedding in zip(df.submission_id, X_topic)
        ]
    else:
        print("Please specify option as ``lsa`` or ``sent_embed``")
        paper_embeddings = None
    return paper_embeddings


if __name__ == "__main__":
    arguments = docopt(__doc__, version="0.1")
    save_path = op.join("..", "sitedata", "embeddings")
    # create embeddings
    if not op.exists(save_path):
        os.makedirs(save_path)

    with open("es_config.yml") as f:
        es_config = yaml.load(f, Loader=yaml.FullLoader)

    # option if not specified, set option as `sent_embed`
    option = arguments.get("--option")
    if option is None:
        option = "lsa"

    for k, v in tqdm(es_config["editions"].items()):
        print(f"Calculate embeddings for edition {k}\n")
        basename = f"agenda-{k}"
        path = v.get("path", "")
        if path.lower().endswith(".json"):
            df = pd.read_json(path).fillna("")
        elif path.lower().endswith(".csv"):
            df = pd.read_csv(path).fillna("")
        elif v.get("airtable_id") is not None:
            # if filter_accepted, only filter accepted submissions
            filter_accepted = v.get("filter_accepted", False)
            submissions = Table(airtable_key, v["airtable_id"], v["table_name"]).all()
            submissions = read_submissions(
                submissions, keys=keys_airtable, filter_accepted=filter_accepted
            )
            df = pd.DataFrame(submissions).fillna("")
        else:
            df = pd.read_csv(path).fillna("")

        # calculate embeddings, save in JSON with the same basename
        if len(df) > 0:
            paper_embeddings = calculate_embeddings(df, option=option)
            json.dump(
                paper_embeddings,
                open(op.join(save_path, basename + ".json"), "w"),
                indent=2,
            )

            # nearest neighbors, save in joblib with the same basename
            X = np.vstack([p["embedding"] for p in paper_embeddings])
            nbrs_model = NearestNeighbors(n_neighbors=len(X)).fit(X)
            joblib.dump(nbrs_model, op.join(save_path, basename + ".joblib"))
            print(f"Saved embeddings and nearest neighbor model for edition {k}")
        else:
            print("Length of dataframe is 0, please recheck the data")
