"""
Transform text to embeddings using 
Original code from https://github.com/Mini-Conf/Mini-Conf/blob/master/scripts/embeddings.py

Usage:
    python embeddings.py

Options:
    -h --help       Show this screen
    --version       Show version
    -o --option     Embedding option, can be ``lsa`` or ``sent_embed``, default ``lsa``
"""
import os
import os.path as op
import json
from glob import glob
from docopt import docopt

import joblib
import numpy as np
import pandas as pd
from tqdm import tqdm
from sentence_transformers import SentenceTransformer

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.neighbors import NearestNeighbors


MAX_BATCH_SIZE = 16
EMBEDDING_OPTION = "sent_embed"


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


def calculate_embeddings(df, option="lsa", n_papers=10):
    """Calculates embeddings from a given dataframe
    assume dataframe has title and abstract in the columns

    option: str, if ``lsa`` use Latent Semantic Analysis
        if ``sent_embed`` use Specter from AllenAI
    n_papers: int, default 10
        Group papers into smaller list for embedding computations
        Larger one takes too long on regular laptop
    """
    if option == "sent_embed":
        print("Download model and produce embedding\n")
        model = SentenceTransformer("allenai-specter")
        papers = list(df["title"] + "[SEP]" + df["abstract"])
        # group papers
        papers_embedding = []
        for g in tqdm(chunks(papers)):
            embeddings = model.encode(g, convert_to_numpy=True)
            papers_embedding.extend(embeddings)
        paper_embeddings = [
            {"submission_id": pid, "embedding": list(embedding)}
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
    save_path = op.join("..", "sitedata", "embeddings")
    # create embeddings
    if not op.exists(save_path):
        os.makedirs(save_path)
    paths = glob(op.join("..", "sitedata", "agenda", "*.csv")) + glob(op.join("..", "sitedata", "agenda", "*.json"))
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
        paper_embeddings = calculate_embeddings(df, option=EMBEDDING_OPTION)
        json.dump(paper_embeddings, open(op.join(save_path, basename + '.json'), "w"))

        # nearest neighbors, save in joblib with the same basename
        X = np.vstack([p["embedding"] for p in paper_embeddings])
        nbrs_model = NearestNeighbors(n_neighbors=len(X)).fit(X)
        joblib.dump(nbrs_model, op.join(save_path, basename + '.joblib'))
