import { expect } from 'chai'
import Room from '../src/classes/Room.js'
const data = require('../src/data/room.js')

describe('Room', () => {

  let allRooms = data.roomsData
  let room1, room2

  beforeEach(() => {
    room1 = new Room(allRooms[0])
    room2 = new Room(allRooms[1])
  })

  it('Should be a function', () => {
    expect(Room).to.be.a('function')
  })

  it('Should store a room number', () => {
    expect(room1.roomNumber).to.equal(2)
    expect(room2.roomNumber).to.equal(5)
  })

  it('Should store a room type', () => {
    expect(room1.roomType).to.equal('suite')
    expect(room2.roomType).to.equal('single room')
  })

  it('Should store a bidet boolean', () => {
    expect(room1.bidet).to.equal(false)
    expect(room2.bidet).to.equal(true)
  })

  it('Should store bed size', () => {
    expect(room1.bedSize).to.equal('full')
    expect(room2.bedSize).to.equal('queen')
  })

  it ('Should store number of beds', () => {
    expect(room1.numBeds).to.equal(2)
    expect(room2.numBeds).to.equal(2)
  })

  it('Should store a cost per night', () => {
    expect(room1.costPerNight).to.equal(477.38)
    expect(room2.costPerNight).to.equal(340.17)
  })
})