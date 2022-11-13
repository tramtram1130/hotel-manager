class AllBookings {
  constructor(bookings) {
    this.bookings = bookings
    // this.customerId = booking.userID
    // this.bookingDate = booking.date
    // this.roomNumber = booking.roomNumber
  }
  getUnavailableRooms = (date) => {
    let roomsBookedOnSelectedDate = this.bookings.reduce((arr, booking) => {
      if ( (new Date(booking.date).toISOString()).split('T')[0] === date && (!arr.includes(booking))) {
        arr.push(booking.roomNumber)
      }
      return arr
    }, [])
    return roomsBookedOnSelectedDate
  }
}

export default AllBookings