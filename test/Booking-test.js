import { expect } from 'chai'
import AllBookings from '../src/classes/Booking.js'
const roomsData = require('../src/data/room.js')
const customersData = require('../src/data/customer.js')
const bookingsData = require('../src/data/booking.js')

describe('AllBookings', () => {
  
  let allBookingsData = bookingsData.bookingsData
  let allRooms = roomsData.roomsData
  let allCustomers = customersData.customersData
  let bookings1

  beforeEach(() => {
    bookings1 = new AllBookings(allBookingsData)
  })

  it('Should be a function', () => {
    expect(AllBookings).to.be.a('function')
  })

  it('Should store all bookings', () => {
    expect(bookings1.bookings).to.be.an('array')
  })

  it('Should return booked rooms on specified date with method getUnavailableRooms()', () => {
    expect(bookings1.getUnavailableRooms('2022-02-14')).to.deep.equal([6])
    expect(bookings1.getUnavailableRooms('2022-02-15')).to.deep.equal([])
  })

  // it('Should store a booking ID', () => {
  //   expect(booking1.bookingId).to.equal("5fwrgu4i7k55hl6ta")
  //   expect(booking2.bookingId).to.equal("5fwrgu4i7k55hl6xq")
  // })

  // it('Should store a customer ID', () => {
  //   expect(booking1.customerId).to.equal(25)
  //   expect(booking2.customerId).to.equal(42)
  // })

  // it('Should store a booking date', () => {
  //   expect(booking1.bookingDate).to.equal("2022/01/11")
  //   expect(booking2.bookingDate).to.equal("2022/02/14")
  // })

  // it('Should store a room number', () => {
  //   expect(booking1.roomNumber).to.equal(9)
  //   expect(booking2.roomNumber).to.equal(6)
  // })

  // it('Should store a cost per night with the method getRoomCostPerNight()', () => {
  //   booking1.getRoomCostPerNight(allRooms)
  //   booking2.getRoomCostPerNight(allRooms)
  //   expect(booking1.costPerNight).to.equal(200.39)
  //   expect(booking2.costPerNight).to.equal(397.02)
  // })
  

})