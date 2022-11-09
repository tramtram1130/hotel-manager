class Customer {
  constructor(customer) {
    this.id = customer.id
    this.name = customer.name
    this.pastBookings = []
    this.futureBookings = []
    this.totalSpending = 0
  }
}

export default Customer