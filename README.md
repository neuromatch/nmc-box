# Neuromatch in a box

Without technology backbone, making a conference is probably hard for many organizers.
In 2020, we built [Neuromatch conferences](https://neuromatch.io/conference/)
which allow organizers to automate many aspects of the conference. Here, we try to
open-source multiple aspects for other organizers.

## Structure

* Frontend using ReactJS
* Backend using Python

## Components

* Registration
* Recommendation engine
* Mind matching (run separately to produce output)
* Schedule optimization (TBA)
* Payment using Stripe

## Workflow

* Put data in `sitedata/agenda/*.csv`
* In `scripts` folder, change information in `es_config.yml` where you can put data from Airtable

``` sh
python embeddings.py --option=sent_embed # create embedding
bash serve_elasticsearch.sh # serve elasticsearch
python es_index.py # index ElasticSearch
```
