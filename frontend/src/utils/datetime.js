import moment from "moment-timezone"

const timezoneParser = (dtStr, tz) =>
  moment.tz(dtStr, "MMMM DD, YYYY HH:mm", tz)

export default {
  timezoneParser,
}
