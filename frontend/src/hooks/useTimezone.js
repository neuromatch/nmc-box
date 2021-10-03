import moment from "moment-timezone"
import { useCookies } from "react-cookie"

// -- CONSTANTS
const timezoneCookieKey = "timezone"
// guess user timezone
const defaultGuessZone = moment.tz.guess()

// -- FUNCTION
const timezoneParser = (dtStr, tz) =>
  moment.tz(dtStr, "MMMM DD, YYYY HH:mm", tz)

// -- MAIN
const useTimezone = () => {
  // timezone and cookies
  const [cookies, setCookie] = useCookies([timezoneCookieKey])

  return {
    timezone: cookies[timezoneCookieKey] || defaultGuessZone,
    setTimezone: (tz) => setCookie(timezoneCookieKey, tz),
  }
}

export { timezoneParser }
export default useTimezone
