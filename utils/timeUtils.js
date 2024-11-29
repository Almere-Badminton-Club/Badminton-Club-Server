const { utcToZonedTime } = require('date-fns-tz');

function convertToCET(date) {
    const cetTimeZone = "Europe/Amsterdam";
    return utcToZonedTime(new Date(date), cetTimeZone); 
}

console.log(convertToCET(new Date()));  // Convert to CET time
module.exports = { convertToCET };
