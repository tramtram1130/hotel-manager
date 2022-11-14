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
    this.totalSpending = 0
    let bookedRooms = this.pastBookings.concat(this.futureBookings)
    let bookedRoomNumbers = bookedRooms.map(room => room.roomNumber)
    bookedRoomNumbers.forEach(bookedRoom => {
      allRooms.forEach(room => {
        if (bookedRoom === room.number) {
         this.totalSpending += room.costPerNight
        }
      })
    })
    return this.totalSpending
  }
}

export default Customer