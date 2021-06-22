import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment-timezone';

// -- CONSTANTS
const timezoneCookieKey = 'timezone';
// guess user timezone
const defaultGuessZone = moment.tz.guess();

// -- MAIN
const useTimezone = () => {
  // timezone and cookies
  const [cookies, setCookie] = useCookies([timezoneCookieKey]);
  const [timezone, setTimezone] = useState(
    cookies[timezoneCookieKey] || defaultGuessZone,
  );

  useEffect(() => {
    setCookie(timezoneCookieKey, timezone);
  }, [setCookie, timezone]);

  return {
    timezone,
    setTimezone,
  };
};

export default useTimezone;
