import { expect } from 'chai'
import Room from '../src/classes/Room.js'
import Customer from '../src/classes/Customer.js'
import Booking from '../src/classes/Booking.js'
const roomsData = require('../src/data/room.js')
const customersData = require('../src/data/customer.js')
const bookingsData = require('../src/data/booking.js')

describe('Customer', () => {

  let allRooms = roomsData.roomsData
  let allBookings = bookingsData.bookingsData
  let allCustomers = customersData.customersData
  let customer1, customer2, customer3

  beforeEach(() => {
    customer1 = new Customer(allCustomers[0])
    customer2 = new Customer(allCustomers[1])
    customer3 = new Customer(allCustomers[2])
  })

  it('Should be a function', () => {
    expect(Customer).to.be.a('function')
  })

  it('Should store customer ID', () => {
    expect(customer1.id).to.equal(25)
    expect(customer2.id).to.equal(7)
  })

  it('Should store customer name', () => {
    expect(customer1.name).to.equal('Rashawn Langworth')
    expect(customer2.name).to.equal('Dell Rath')
  })

  it('Should store past bookings with method getPastBookings()', () => {
    customer1.getPastBookings(allBookings)
    customer2.getPastBookings(allBookings)
    expect(customer1.pastBookings.length).to.equal(3)
    expect(customer2.pastBookings.length).to.equal(2)
  })

  it('Should store bookings from before today as past bookings', () => {
    let today = new Date()
    customer1.getPastBookings(allBookings)
    expect(new Date(customer1.pastBookings[0].date).getTime()).to.be.lessThan(today.getTime())
    expect(new Date(customer1.pastBookings[1].date).getTime()).to.be.lessThan(today.getTime())
  })

  it('Should store future bookings with method getFutureBookings()', () => {
    customer1.getFutureBookings(allBookings)
    customer2.getFutureBookings(allBookings)
    expect(customer1.futureBookings.length).to.equal(2)
    expect(customer2.futureBookings.length).to.equal(3)
  })

  it('Should store bookings after today as future bookings', () => {
    let today = new Date()
    customer1.getFutureBookings(allBookings)
    expect(new Date(customer1.futureBookings[0].date).getTime()).to.be.greaterThan(today.getTime())
    expect(new Date(customer1.futureBookings[1].date).getTime()).to.be.greaterThan(today.getTime())
  })

  it('Should store total spent from all bookings', () => {
    customer2.getPastBookings(allBookings)
    customer2.getFutureBookings(allBookings)
    customer2.getTotalSpent(allRooms)
    customer3.getPastBookings(allBookings)
    customer3.getFutureBookings(allBookings)
    customer3.getTotalSpent(allRooms)
    expect(customer2.totalSpending).to.equal(1773.07)
    expect(customer3.totalSpending).to.equal(874.4)
  })

})