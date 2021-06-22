# Frontend for neuromatch

## Requirements

There is a firebase configuration file, `.env`, stored in the Google Drive. Please place the file here in the root of the `frontend/` directory. The current `.env` file looks like follows

``` sh
GATSBY_FIREBASE_API_KEY='___'
GATSBY_FIREBASE_AUTH_DOMAIN='___.firebaseapp.com'
GATSBY_FIREBASE_DATABASE_URL='https://___.firebaseio.com'
GATSBY_FIREBASE_PROJECT_ID='___'
GATSBY_FIREBASE_STORAGE_BUCKET='___.appspot.com'
GATSBY_FIREBASE_MESSAGING_SENDER_ID='___'
GATSBY_FIREBASE_APP_ID='___'
GATSBY_FIREBASE_MEASUREMENT_ID='___'
```

## Start frontend

Run the frontend site by the following:

```sh
# only once on first time
npm install -g gatsby-cli

# run the frontend app
npm install
npm start
```

This will run

- frontend on port `8000`
- backend on port `8888`
- Elasticsearch on port `9200`

all at once.
