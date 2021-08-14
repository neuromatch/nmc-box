# Scripts

Contain script to preprocess submissions to embeddings for recommendation
and index data to Elasticsearch.

## Create Embeddings

First run `embeddings.py` to generate agenda to
embedding for our recommendation engine.

``` sh
python embeddings.py --option=sent_embed # or lsa
```

## Download and index data to Elasticsearch

Index GRID and submission. The first script will Download GRID dataset from [https://grid.ac/downloads](https://grid.ac/downloads)
then put this root then download and serve Elasticsearch. The second line will index data specified in `es_config.yml` to Elasticsearch.

``` sh
bash serve_elasticsearch.sh
python es_index.py
```
