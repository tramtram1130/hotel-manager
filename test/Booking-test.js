import { expect } from 'chai'
import Booking from '../src/classes/Booking.js'
const roomsData = require('../src/data/room.js')
const customersData = require('../src/data/customer.js')
const bookingsData = require('../src/data/booking.js')

describe('Booking', () => {
  
  let allBookings = bookingsData.bookingsData
  let allRooms = roomsData.roomsData
  let allCustomers = customersData.customersData
  let booking1, booking2

  beforeEach(() => {
    booking1 = new Booking(allBookings[0])
    booking2 = new Booking(allBookings[11])
  })

  it('Should be a function', () => {
    expect(Booking).to.be.a('function')
  })

  it('Should store a booking ID', () => {
    expect(booking1.bookingId).to.equal("5fwrgu4i7k55hl6ta")
    expect(booking2.bookingId).to.equal("5fwrgu4i7k55hl6xq")
  })

  it('Should store a customer ID', () => {
    expect(booking1.customerId).to.equal(25)
    expect(booking2.customerId).to.equal(42)
  })

  it('Should store a booking date', () => {
    expect(booking1.bookingDate).to.equal("2022/01/11")
    expect(booking2.bookingDate).to.equal("2022/02/14")
  })

  it('Should store a room number', () => {
    expect(booking1.roomNumber).to.equal(9)
    expect(booking2.roomNumber).to.equal(6)
  })

  it('Should store a cost per night with the method getRoomCostPerNight()', () => {
    booking1.getRoomCostPerNight(allRooms)
    booking2.getRoomCostPerNight(allRooms)
    expect(booking1.costPerNight).to.equal(200.39)
    expect(booking2.costPerNight).to.equal(397.02)
  })

})