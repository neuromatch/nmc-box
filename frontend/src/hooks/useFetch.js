import { useState, useEffect } from 'react';
import useFirebaseWrapper from './useFirebaseWrapper';

/**
 * @typedef {Object} UseFetchResult
 * @property {*} result - a result of fetch
 * @property {Object} error - an error object of fetch
 * @property {boolean} isLoading - indicator for loading status
 */

/**
 * @typedef PostBody
 * @property {string=} id a uid of the user
 *
 * useFetchPost: only operate if URL and body are defined
 * @param {string} url A fetch URL
 * @param {*} [defaultResult] A default fetching result
 * @param {PostBody} [postBody] A body of POST method
 * @param {function(Object):void} [successCallback] A callback function to be called on success
 * @param {function} [failedCallback] A call back function to be called on failed
 * @return {UseFetchResult}
 */
function useFetchPost(url, defaultResult, postBody, successCallback, failedCallback) {
  const [result, setResult] = useState(defaultResult);
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // prepare here so that useEffect dependencies is a string
  const preparedBody = JSON.stringify(postBody);

  useEffect(() => {
    let isActive = true;

    if (url && preparedBody) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: preparedBody,
      })
        .then((res) => res.json())
        .then((resJson) => {
          if (isActive) {
            if (successCallback) {
              successCallback(resJson);
            }
            setResult(resJson);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (isActive) {
            if (failedCallback) {
              failedCallback();
            }
            setError(err);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isActive = false;
    };
  }, [failedCallback, preparedBody, successCallback, url]);

  return { result, error, isLoading };
}

/**
 * useFetchGet: only operate if URL is defined
 * @param {string} url A fetch URL
 * @param {*} [defaultResult] A default value before fetching start
 * @param {function(Object):void} [successCallback] A callback function to be called on success
 * @param {function} [failedCallback] A call back function to be called on failed
 * @return {UseFetchResult}
 */
function useFetchGet(url, defaultResult, successCallback, failedCallback) {
  const [result, setResult] = useState(defaultResult);
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    if (url) {
      fetch(url)
        .then((res) => res.json())
        .then((resJson) => {
          if (isActive) {
            if (successCallback) {
              successCallback(resJson);
            }
            setResult(resJson);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (isActive) {
            if (failedCallback) {
              failedCallback();
            }
            setError(err);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isActive = false;
    };
  }, [failedCallback, successCallback, url]);

  return { result, error, isLoading };
}

/**
 * @typedef PostBody
 * @property {string=} id a uid of the user
 *
 * useAuthenFetchPost: only operate if URL and body are defined, also need
 * the user to be logged in correctly. This works by getting jwt token from
 * firebase instance and send to the backend. The backend then check if that
 * token is valid and allow/drop the request later.
 * @param {string} url A fetch URL
 * @param {*} [defaultResult] A default fetching result
 * @param {PostBody} [postBody] A body of POST method
 * @param {function(Object):void} [successCallback] A callback function to be called on success
 * @param {function} [failedCallback] A call back function to be called on failed
 * @return {UseFetchResult}
 */
function useAuthenFetchPost(url, defaultResult, postBody, successCallback, failedCallback) {
  const [result, setResult] = useState(defaultResult);
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [idToken, setIdToken] = useState(undefined);

  const { currentUserInfo, isLoggedIn } = useFirebaseWrapper();

  // prepare here so that useEffect dependencies is a string
  const preparedBody = JSON.stringify(postBody);

  if (currentUserInfo) {
    currentUserInfo.getIdToken().then((idt) => setIdToken(idt));
  }

  useEffect(() => {
    let isActive = true;

    if (url && preparedBody && isLoggedIn && idToken) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: preparedBody,
      })
        .then((res) => res.json())
        .then((resJson) => {
          if (isActive) {
            if (successCallback) {
              successCallback(resJson);
            }
            setResult(resJson);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (isActive) {
            if (failedCallback) {
              failedCallback();
            }
            setError(err);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isActive = false;
    };
  }, [failedCallback, idToken, isLoggedIn, preparedBody, successCallback, url]);

  return { result, error, isLoading };
}

/**
 * useAuthenFetchGet: only operate if URL is defined, also need the user to be
 * logged in correctly. This works by getting jwt token from firebase instance
 * and send to the backend. The backend then check if that token is valid and
 * allow/drop the request later.
 * @param {string} url A fetch URL
 * @param {*} [defaultResult] A default value before fetching start
 * @param {function(Object):void} [successCallback] A callback function to be called on success
 * @param {function} [failedCallback] A call back function to be called on failed
 * @return {UseFetchResult}
 */
function useAuthenFetchGet(url, defaultResult, successCallback, failedCallback) {
  const [result, setResult] = useState(defaultResult);
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [idToken, setIdToken] = useState(undefined);

  const { currentUserInfo, isLoggedIn } = useFirebaseWrapper();

  if (currentUserInfo) {
    currentUserInfo.getIdToken().then((idt) => setIdToken(idt));
  }

  useEffect(() => {
    let isActive = true;

    // only make a request when there is a URL, user is logged in,
    // and there is a idToken get from firebase instance
    if (url && isLoggedIn && idToken) {
      fetch(url, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
        .then((res) => res.json())
        .then((resJson) => {
          if (isActive) {
            if (successCallback) {
              successCallback(resJson);
            }
            setResult(resJson);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (isActive) {
            if (failedCallback) {
              failedCallback();
            }
            setError(err);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isActive = false;
    };
  }, [failedCallback, idToken, isLoggedIn, successCallback, url]);

  return { result, error, isLoading };
}

const fetchGet = (
  idToken,
  fetchUrl,
  beforeFetchCallback,
  succeededCallback,
  failedCallback,
  finalFetchCallback,
) => {
  // -- call a callback before fetching
  beforeFetchCallback();

  fetch(fetchUrl,
    idToken && {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return failedCallback(response);
    })
    .then((resJson) => {
      succeededCallback(resJson);
    })
    .finally(() => {
      finalFetchCallback();
    });
};

export {
  useFetchGet, useFetchPost, useAuthenFetchGet, useAuthenFetchPost, fetchGet,
};
