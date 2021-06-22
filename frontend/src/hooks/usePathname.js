import { useState, useEffect } from 'react';

function usePathname() {
  const isClient = typeof window === 'object';

  const [lastPath, setLastPath] = useState(undefined);

  // set initial value derived from the search query params
  useEffect(() => {
    const extractedPath = isClient
      ? window.location.pathname?.split('/')?.slice(-1)?.[0]
      : '';

    setLastPath(extractedPath);
  }, [isClient]);

  return lastPath;
}

export default usePathname;
