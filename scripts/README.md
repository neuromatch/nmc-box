# Scripts

Run the following scripts before starting the conference

## Download GRID dataset

Download GRID dataset from [https://grid.ac/downloads](https://grid.ac/downloads) and put in `sitedata`.
Make sure `server.yml` has correct paths to downloaded GRID files.

## Embeddings

First run `embeddings.py` to generate agenda to
embedding for our recommendation engine.

``` sh
python embeddings.py --option=sent_embed # or lsa
```

## Elastic Search

Index GRID and submission

``` sh
bash serve_elasticsearch.sh
python es_index.py
```
