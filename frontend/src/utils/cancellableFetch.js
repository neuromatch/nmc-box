// https://itnext.io/how-you-can-abort-fetch-request-on-a-flight-830a639b9b92

/**
 * cancellableFetch
 * @param {string} url A fetch URL
 * @param {Object} params An object of fetch options
 */
function cancellableFetch(url, params) {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchParams = {
    ...params,
    signal, // extend provided params with AbortController signal
  };

  const promise = fetch(
    url,
    fetchParams,
  )
    .then((res) => res.json()); // only need this if response is json

  // return a promist that return json response
  return [
    promise,
    controller.abort.bind(controller), // notice binding context
  ];
}

export default cancellableFetch;
