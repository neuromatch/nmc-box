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
from glob import glob
from docopt import docopt

import joblib
import numpy as np
import pandas as pd
from tqdm.auto import tqdm
from transformers import AutoTokenizer, AutoModel

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.neighbors import NearestNeighbors

print("Download SPECTER model for creating embedding\n")
tokenizer = AutoTokenizer.from_pretrained('allenai/specter')
model = AutoModel.from_pretrained('allenai/specter')
MAX_BATCH_SIZE = 16


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


def calculate_embeddings(df, option="lsa", n_papers=MAX_BATCH_SIZE):
    """Calculates embeddings from a given dataframe
    assume dataframe has title and abstract in the columns

    option: str, if ``lsa`` use Latent Semantic Analysis
        if ``sent_embed`` use Specter from AllenAI
    n_papers: int, default 10
        Group papers into smaller list for embedding computations
        Larger one takes too long on regular laptop
    """
    assert option in ["lsa", "sent_embed"]
    if option == "sent_embed":
        papers = list(df["title"] + "[SEP]" + df["abstract"])
        # group papers
        embeddings = []
        for g in tqdm(chunks(papers, chunk_size=n_papers)):
            inputs = tokenizer(g, padding=True,
                               truncation=True,
                               return_tensors="pt",
                               max_length=512)
            result = model(**inputs)
            embeddings.extend(result.last_hidden_state[:, 0, :])
        embeddings = [emb.tolist() for emb in embeddings]
        paper_embeddings = [
            {"submission_id": pid, "embedding": embedding}
            for pid, embedding in zip(df.submission_id, embeddings)
        ]
    elif option == "lsa":
        tfidf_model = TfidfVectorizer(
            min_df=3, max_df=0.85,
            lowercase=True, norm='l2',
            ngram_range=(1, 2),
            use_idf=True, smooth_idf=True,
            sublinear_tf=True,
            stop_words='english'
        )
        topic_model = TruncatedSVD(n_components=30, algorithm='arpack')
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
    paths = glob(op.join("..", "sitedata", "agenda", "*.csv")) + glob(op.join("..", "sitedata", "agenda", "*.json"))

    # option if not specified, set option as `sent_embed`
    option = arguments.get('--option')
    if option is None:
        option = "sent_embed"

    for path in tqdm(paths):
        print(f"Calculate embeddings for {path}\n")
        basename = op.basename(path).split('.')[0]

        if path.lower().endswith(".json"):
            df = pd.read_json(path).fillna("")
        elif path.lower().endswith(".csv"):
            df = pd.read_csv(path).fillna("")
        else:
            df = pd.read_csv(path).fillna("")

        # calculate embeddings, save in JSON with the same basename
        paper_embeddings = calculate_embeddings(df, option=option)
        json.dump(
            paper_embeddings, open(op.join(save_path, basename + '.json'), "w"),
            indent=2
        )

        # nearest neighbors, save in joblib with the same basename
        X = np.vstack([p["embedding"] for p in paper_embeddings])
        nbrs_model = NearestNeighbors(n_neighbors=len(X)).fit(X)
        joblib.dump(nbrs_model, op.join(save_path, basename + '.joblib'))
