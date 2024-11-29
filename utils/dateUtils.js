// Function to get booking date based on dayIndex and a reference date
function getBookingDate(dayIndex, selectedDate) {
  const bookingDate = new Date(selectedDate);
  // Set the day of the week based on dayIndex
  bookingDate.setDate(bookingDate.getDate() + (dayIndex - bookingDate.getDay()));
  return bookingDate;
}
