import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

function useWindowSize() {
  const isClient = typeof window === 'object';

  const getSize = useCallback(() => ({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  }), [isClient]);

  const [windowSize, setWindowSize] = useState(getSize);

  const [debouncedCallback] = useDebouncedCallback(
    () => setWindowSize(getSize()),
    300,
    {
      maxWait: 2000,
    },
  );

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    window.addEventListener('resize', debouncedCallback);
    return () => window.removeEventListener('resize', debouncedCallback);
  }, [debouncedCallback, getSize, isClient]);

  return windowSize;
}

export default useWindowSize;
