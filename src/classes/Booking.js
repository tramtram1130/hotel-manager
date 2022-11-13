class Booking {
  constructor(booking) {
    this.bookingId = booking.id
    this.customerId = booking.userID
    this.bookingDate = booking.date
    this.roomNumber = booking.roomNumber
  }
  getRoomCostPerNight = (allRooms) => {
    allRooms.forEach(room => {
      if (this.roomNumber === room.number) {
        this.costPerNight = room.costPerNight
      }
    })
  }
}

export default Booking