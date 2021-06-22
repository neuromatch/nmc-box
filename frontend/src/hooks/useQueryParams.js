import { useState, useEffect } from 'react';

function useQueryParams(key) {
  const isClient = typeof window === 'object';

  const [searchQuery, setSearchQuery] = useState(undefined);
  const params = isClient
    ? new URLSearchParams(window.location.search)
    : { get: () => {}, set: () => {} };

  // set initial value derived from the search query params
  useEffect(() => {
    const initVal = params.get(key);
    // prevent ?id=null
    if (initVal) {
      setSearchQuery(initVal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // side effect in case params or searchQuery changed
  useEffect(() => {
    params.set(key, searchQuery);

    if (searchQuery === undefined) {
      window.history.replaceState({}, '', `${window.location.pathname}`);
    } else {
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }
  }, [key, params, searchQuery]);

  return [searchQuery, setSearchQuery];
}

export default useQueryParams;
