import { expect } from 'chai'
import AllBookings from '../src/classes/Booking.js'
const roomsData = require('../src/data/room.js')
const customersData = require('../src/data/customer.js')
const bookingsData = require('../src/data/booking.js')
const allBookedData = require('../src/data/allRoomsBooked')

describe('AllBookings', () => {
  
  let allBookingsData = bookingsData.bookingsData
  let allBookedRoomsData = allBookedData.allBookedData
  let allRooms = roomsData.roomsData
  let allCustomers = customersData.customersData
  let bookings1, bookings2

  beforeEach(() => {
    bookings1 = new AllBookings(allBookingsData)
    bookings2 = new AllBookings(allBookedRoomsData)
  })

  it('Should be a function', () => {
    expect(AllBookings).to.be.a('function')
  })

  it('Should store all bookings', () => {
    expect(bookings1.bookings).to.be.an('array')
  })

  it('Should return an array of unavailable room numbers on a specified date using method getUnavailableRooms()', () => {
    expect(bookings1.getUnavailableRooms('2022-02-14')).to.deep.equal([2, 6])
  })

  it('Should return an empty array of unavailable rooms on a specified date with no rooms booked using method getUnavailableRooms()', () => {
    expect(bookings1.getUnavailableRooms('2022-02-15')).to.deep.equal([])
  })

  it('Should return an array of available rooms on specified date with method getAvailableRooms() after getting unavailable rooms', () => {
    let unavailableRooms = bookings1.getUnavailableRooms('2022-02-15')
    expect(bookings1.getAvailableRooms(allRooms, unavailableRooms)).to.deep.equal([
      {
        number: 2,
        roomType: 'suite',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 477.38
      },
      {
        number: 5,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 340.17
      },
      {
        number: 6,
        roomType: 'junior suite',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 397.02
      },
      {
        number: 8,
        roomType: 'junior suite',
        bidet: false,
        bedSize: 'king',
        numBeds: 1,
        costPerNight: 261.26
      },
      {
        number: 9,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 200.39
      },
      {
        number: 10,
        roomType: 'suite',
        bidet: false,
        bedSize: 'twin',
        numBeds: 1,
        costPerNight: 497.64
      },
      {
        number: 11,
        roomType: 'single room',
        bidet: true,
        bedSize: 'twin',
        numBeds: 2,
        costPerNight: 207.24
      },
      {
        number: 20,
        roomType: 'residential suite',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 343.95
      },
      {
        number: 22,
        roomType: 'single room',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 350.31
      }
    ])
  })

  it('Should return an empty array of available rooms on specified date with method getAvailableRooms() after getting unavailable rooms', () => {
    let unavailableRooms = bookings2.getUnavailableRooms('2022-12-12')
    expect(bookings2.getAvailableRooms(allRooms, unavailableRooms)).to.deep.equal([])
  })
})