const { utcToZonedTime } = require("date-fns-tz");

// Converts date to CET (Central European Time)
function convertToCET(date) {
  const cetTimeZone = "Europe/Amsterdam";
  return utcToZonedTime(new Date(date), cetTimeZone); // Converts UTC date to CET time
}

module.exports = { convertToCET };
