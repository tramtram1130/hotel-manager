class Customer {
  constructor(customer) {
    this.id = customer.id
    this.name = customer.name
    this.pastBookings = []
    this.futureBookings = []
    this.totalSpending = 0
  }
  getPastBookings = (allBookings) => {
    this.pastBookings = allBookings.filter(booking => {
      let today = new Date()
      let bookingDate = new Date(booking.date)
      if (booking.userID === this.id && today.getTime() > bookingDate.getTime()) {
        return booking
      }
    })
  }
  getFutureBookings = (allBookings) => {
    this.futureBookings = allBookings.filter(booking => {
      let today = new Date()
      let bookingDate = new Date(booking.date)
      if (booking.userID === this.id && today.getTime() < bookingDate.getTime()) {
        return booking
      }
    })
  }
  getTotalSpent = (allRooms) => {
    let bookedRooms = this.pastBookings.concat(this.futureBookings)
    let bookedRoomNumbers = bookedRooms.map(room => room.roomNumber)
    allRooms.forEach(room => {
      if (bookedRoomNumbers.includes(room.number)) {
        this.totalSpending += room.costPerNight
      }
    })
  }
}

export default Customer