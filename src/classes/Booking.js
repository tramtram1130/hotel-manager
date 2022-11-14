class AllBookings {
  constructor(bookings) {
    this.bookings = bookings
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
  getAvailableRooms = (allRooms, unavailableRooms) => {
    let availableRooms = allRooms.filter(room => {
      if (!unavailableRooms.includes(room.number)) {
        return room
      }
    })
    return availableRooms
  }
}

export default AllBookings