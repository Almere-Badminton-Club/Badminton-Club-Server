// Function to calculate the booking date based on dayIndex and a reference date
function getBookingDate(dayIndex, selectedDate) {
  // Ensure selectedDate is a valid Date object
  const referenceDate = new Date(selectedDate); // Reference date from the request
  const currentDay = referenceDate.getDay();   // Current day of the week (0 = Sunday, 6 = Saturday)

  // Calculate the day difference using modular arithmetic
  const dayDifference = (dayIndex - currentDay + 7) % 7;

  // Set the date to the calculated day
  referenceDate.setDate(referenceDate.getDate() + dayDifference);

  // Return the updated booking date
  return referenceDate;
}

module.exports = { getBookingDate };
