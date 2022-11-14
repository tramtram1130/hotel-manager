// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
import Customer from './classes/Customer.js'
import Room from './classes/Room.js'
import AllBookings from './classes/Booking.js'
import { allBookedData } from './data/allRoomsBooked';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/bathhouse.png'

// GLOBAL VARIABLES

let customersData
let roomsData
let bookingsData
let currentUser
let today = ((new Date()).toISOString()).split('T')[0]
let allBookedTestData = new AllBookings(allBookedData)

// QUERY SELECTORS

const pastBookings = document.querySelector('.past-bookings-body') 
const futureBookings = document.querySelector('.future-bookings-body')
const totalSpending = document.querySelector('.spending-title')
const guestPortalButton = document.querySelector('.guest-portal-button')
const guestPortalView = document.querySelector('.guest-portal-container')
const dateForm = document.querySelector('.date-form')
const roomForm = document.querySelector('.room-form')
const apologyMessage = document.querySelector('.apology-title')
const bookedMessage = document.querySelector('.booked-message-title')
const checkDateAvailabilityButton = document.querySelector('.check-date-availability-button')
const checkRoomAvailabilityButton = document.querySelector('.check-room-availability-button')
const availableRoomsTitle = document.querySelector('.available-rooms-title')
const availableRoomsDisplay = document.querySelector('.available-rooms-body')
const availableRoomsView = document.querySelector('.available-rooms-container')

// EVENT LISTENERS

window.addEventListener('load', instantiateData)
guestPortalButton.addEventListener('click', displayGuestPortalView)
checkDateAvailabilityButton.addEventListener('click', getAvailableRooms)
checkRoomAvailabilityButton.addEventListener('click', filterByRoomTypes)

// API CALLS

const gatherData = (url) => {
  return fetch(url)
    .then(response => response.json())
    .catch(err => console.log(err))
}

function instantiateData() {
  Promise.all([
    gatherData('http://localhost:3001/api/v1/customers'),
    gatherData('http://localhost:3001/api/v1/rooms'),
    gatherData('http://localhost:3001/api/v1/bookings')
  ]).then(data => {
      customersData = data[0].customers
      roomsData = data[1].rooms
      bookingsData = new AllBookings(data[2].bookings)
      renderUser()
    })
    .catch(err => console.log(err))
}

function postData(newBooking) {
  fetch('http://localhost:3001/api/v1/bookings', {
    method: 'POST',
    body: JSON.stringify(newBooking),
    headers: {
      'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(response => instantiateData())
  .then(response => displaySuccessfulBooking())
  .catch(err => console.log(err))
}

function renderUser() {
  currentUser = new Customer(customersData[1])
  populateDashboard()
  tidyUpDateForm()
}

function populateDashboard() {
  currentUser.getPastBookings(bookingsData.bookings)
  currentUser.getFutureBookings(bookingsData.bookings)
  currentUser.getTotalSpent(roomsData)
  let totalSpent = (Math.floor((currentUser.getTotalSpent(roomsData)) * 100) / 100).toFixed(2)

  pastBookings.innerHTML = ''
  currentUser.pastBookings.forEach(booking => {
    pastBookings.innerHTML += `<li class='listed-reservations'>Date of stay: ${booking.date} Room number: ${booking.roomNumber}</li><br>`
  })
  futureBookings.innerHTML = ''
  currentUser.futureBookings.forEach(booking => {
    futureBookings.innerHTML += `<li class='listed-reservations'>Date of stay: ${booking.date} Room number: ${booking.roomNumber}</li><br>`
  })
  totalSpending.innerHTML = `Total Spent: $${totalSpent}`
}

function getAvailableRooms() {
  let unavailableRooms = bookingsData.getUnavailableRooms(dateForm.value)
  console.log(unavailableRooms)
  let availableRooms = roomsData.filter(room => {
    if (!unavailableRooms.includes(room.number)) {
      return room
    }
  })
  if (availableRooms.length === 0) {
    apologyMessage.classList.remove('hidden')
    renderAvailableRooms(availableRooms)
  } else {
    apologyMessage.classList.add('hidden')
    renderAvailableRooms(availableRooms)
  }
  return availableRooms
}

function filterByRoomTypes() {
  let availableRooms = getAvailableRooms()
  let filteredAvailableRooms = availableRooms.filter(room => {
    if (room.roomType === roomForm.value) {
      return room
    }
  })
  if (filteredAvailableRooms.length === 0) {
    apologyMessage.classList.remove('hidden')
    renderAvailableRooms(filteredAvailableRooms)
  } else {
    apologyMessage.classList.add('hidden')
    renderAvailableRooms(filteredAvailableRooms)
  }
}

function renderAvailableRooms(availableRooms) {
  availableRoomsDisplay.innerHTML = ''
  availableRooms.forEach(room => {
    let bidetTrue = ` and a luxurious bidet`
    let singleBed = ` ${room.numBeds} ${room.bedSize} bed`
    let manyBeds = ` ${room.numBeds} ${room.bedSize} beds`
    availableRoomsDisplay.innerHTML += `<button class="book-button" value="${room.number}">Book now!</button>`
    availableRoomsDisplay.innerHTML += `<p class="room-type-and-cost">
    ${room.roomType} for $${room.costPerNight} per night
    <br>
    `
    if (room.numBeds === 1 && room.bidet) {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${singleBed} ${bidetTrue}<br><br><br>`
    } else if (room.numBeds === 1 && !room.bidet) {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${singleBed}<br><br><br>`
    } else if (room.numBeds >= 2 && room.bidet) {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${manyBeds} ${bidetTrue}<br><br><br>`
    } else {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${manyBeds}<br><br><br>`
    }
  })
  const bookedButtons = document.querySelectorAll('.book-button')
  bookedButtons.forEach(button => {
    button.addEventListener('click', bookRoom)
  })
  displayAvailableRoomsView()
}

function bookRoom(event) {
  console.log(currentUser.totalSpending)
  let bookedRoomNum = event.target.value
  let newBooking = { userID: currentUser.id, date: formatDateForPost(dateForm.value), roomNumber: parseInt(bookedRoomNum) }
  postData(newBooking)
}

function tidyUpDateForm() {
  dateForm.setAttribute('value', today)
  dateForm.setAttribute('min', today)
}

function displayGuestPortalView() {
  hide(availableRoomsView)
  hide(roomForm)
  unhide(guestPortalView)
}

function displayAvailableRoomsView() {
  hide(guestPortalView)
  hide(bookedMessage)
  unhide(availableRoomsView)
  unhide(availableRoomsDisplay)
  unhide(roomForm)
  unhide(checkRoomAvailabilityButton)
  unhide(availableRoomsTitle)
}

function displaySuccessfulBooking() {
  hide(availableRoomsDisplay)
  hide(roomForm)
  hide(checkRoomAvailabilityButton)
  hide(availableRoomsTitle)
  unhide(bookedMessage)
}

function hide(element) {
  element.classList.add('hidden')
}

function unhide(element) {
  element.classList.remove('hidden')
}

console.log('This is the JavaScript entry file - your code begins here.')