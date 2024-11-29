const { DateTime } = require('luxon');

function convertToCET(date) {
  return DateTime.fromJSDate(date).setZone('Europe/Amsterdam').toJSDate();
}

console.log(convertToCET(new Date()));  // Convert to CET time
