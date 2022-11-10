class Booking {
  constructor(booking) {
    this.bookingId = booking.id
    this.customerId = booking.userID
    this.date = booking.date
    this.roomNumber = booking.roomNumber
  }
}

export default Booking