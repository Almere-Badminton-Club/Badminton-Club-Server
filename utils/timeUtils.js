const { utcToZonedTime, format } = require('date-fns-tz');

function convertToCET(date) {
    const cetTimeZone = "Europe/Amsterdam";
    const zonedDate = utcToZonedTime(new Date(date), cetTimeZone);
    //format for display
    return format(zonedDate, "yyyy-MM-dd HH:mm:ssXXX", { timeZone: cetTimeZone }); 
}

console.log(convertToCET(new Date()));  // Convert to CET time
module.exports = { convertToCET };
