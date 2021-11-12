import moment from "moment-timezone"

/**
 * timezoneParser - a function to parse datetime string in a certain format
 * and return moment object with specified timezone.
 * @param {String} dtStr - datetime string in the format of "MMMM DD, YYYY HH:mm"
 * @param {String} tz - a timezone string from a list of timezones in moment.js
 * https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a
 * @returns {import("moment").MomentTimezone}
 */
const timezoneParser = (dtStr, tz) =>
  moment.tz(dtStr, "MMMM DD, YYYY HH:mm", tz)

/**
 * dateToMomentOfTimezone - a function to turn Date object into a moment object.
 *
 * @description In some occasions, we get datetime as a Date object which its
 * timezone set automatically as system's timezone so we cannot control over it.
 *
 * This function intents to received that Date object and turn it to moment object with
 * the same date and time but of the SPECIFIED TIMEZONE instead of system's timezone.
 *
 * For example:
 * from -> Date object of January 1, 2021 15.35 GMT+7
 * to -> moment object of January 1, 2021 15.35 GMT
 *
 * @param {Date} dateObject -
 * @param {String} tz - a timezone string from a list of timezones in moment.js
 * https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a
 * @returns {import("moment").MomentTimezone}
 */
const dateToMomentOfTimezone = (dateObject, tz) => {
  const dateStringWithNoTimezone = moment(dateObject).format(
    "MMMM DD, YYYY HH:mm"
  )
  const momentObj = timezoneParser(dateStringWithNoTimezone, tz)

  return momentObj
}

export default {
  timezoneParser,
  dateToMomentOfTimezone,
}
