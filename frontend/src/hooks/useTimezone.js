import { useCookies } from "react-cookie"

// -- CONSTANTS
const timezoneCookieKey = "timezone"
// guess user timezone
const defaultGuessZone = moment.tz.guess()

// -- MAIN
const useTimezone = () => {
  // timezone and cookies
  const [cookies, setCookie] = useCookies([timezoneCookieKey])

  return {
    timezone: cookies[timezoneCookieKey] || defaultGuessZone,
    setTimezone: (tz) => setCookie(timezoneCookieKey, tz),
  }
}

export default useTimezone
