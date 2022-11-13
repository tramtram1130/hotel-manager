// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
import Customer from './classes/Customer.js'
import Room from './classes/Room.js'
import AllBookings from './classes/Booking.js'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/bathhouse.png'

// GLOBAL VARIABLES

let customersData
let roomsData
let bookingsData
let currentUser
let today = ((new Date()).toISOString()).split('T')[0]

// QUERY SELECTORS

const pastBookings = document.querySelector('.past-bookings-body') 
const futureBookings = document.querySelector('.future-bookings-body')
const bookingsView = document.querySelector('.all-bookings-container')
const financeView = document.querySelector('.spending-container')
const totalSpending = document.querySelector('.spending-title')
const guestPortalButton = document.querySelector('.guest-portal-button')
const guestPortalView = document.querySelector('.guest-portal-container')
const dateForm = document.querySelector('.date-form')
const roomForm = document.querySelector('.room-form')
const checkDateAvailabilityButton = document.querySelector('.check-date-availability-button')
const checkRoomAvailabilityButton = document.querySelector('.check-room-availability-button')
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

function renderUser() {
  currentUser = new Customer(customersData[0])
  populateDashboard()
  tidyUpDateForm()
}

function populateDashboard() {
  currentUser.getPastBookings(bookingsData.bookings)
  currentUser.getFutureBookings(bookingsData.bookings)
  currentUser.getTotalSpent(roomsData)
  let totalSpent = (Math.floor(currentUser.totalSpending * 100) / 100).toFixed(2)

  pastBookings.innerHTML = ''
  currentUser.pastBookings.forEach(booking => {
    pastBookings.innerHTML += `Date of stay: ${booking.date} Room number: ${booking.roomNumber}<br>`
  })
  futureBookings.innerHTML = ''
  currentUser.futureBookings.forEach(booking => {
    futureBookings.innerHTML += `Date of stay: ${booking.date} Room number: ${booking.roomNumber}<br>`
  })
  totalSpending.innerHTML = `Total Spent: $${totalSpent}`
}

function getAvailableRooms() {
  let unavailableRooms = bookingsData.getUnavailableRooms(dateForm.value)
  let availableRooms = roomsData.filter(room => {
    if (!unavailableRooms.includes(room.number)) {
      return room
    }
  })
  renderAvailableRooms(availableRooms)
  return availableRooms
}

function filterByRoomTypes() {
  let availableRooms = getAvailableRooms()
  let filteredAvailableRooms = availableRooms.filter(room => {
    if (room.roomType === roomForm.value) {
      return room
    }
  })
  renderAvailableRooms(filteredAvailableRooms)
}

function renderAvailableRooms(availableRooms) {
  availableRoomsDisplay.innerHTML = ''
  availableRooms.forEach(room => {
    let bidetTrue = ` and a luxurious bidet`
    let singleBed = ` ${room.numBeds} ${room.bedSize} bed`
    let manyBeds = ` ${room.numBeds} ${room.bedSize} beds`
    availableRoomsDisplay.innerHTML += `<button class="book-button" name="${room.number}">Book now!</button>`
    availableRoomsDisplay.innerHTML += `<p>
    ${room.roomType} for $${room.costPerNight} per night
    <br>
    `
    if (room.numBeds === 1 && room.bidet) {
      availableRoomsDisplay.innerHTML += `Amenities include: ${singleBed} ${bidetTrue}</p><br><br>`
    } else if (room.numBeds === 1 && !room.bidet) {
      availableRoomsDisplay.innerHTML += `Amenities include: ${singleBed}</p><br><br>`
    } else if (room.numBeds >= 2 && room.bidet) {
      availableRoomsDisplay.innerHTML += `Amenities include: ${manyBeds} ${bidetTrue}</p><br><br>`
    } else {
      availableRoomsDisplay.innerHTML += `Amenities include: ${manyBeds}</p><br><br>`
    }
  })
  displayAvailableRoomsView()
}

function tidyUpDateForm() {
  dateForm.setAttribute('value', today)
  dateForm.setAttribute('min', today)
}

// function formatDate(date) {
//   return (new Date(date).toISOString()).split('T')[0]
// }

function displayGuestPortalView() {
  hide(availableRoomsView)
  hide(roomForm)
  unhide(guestPortalView)
}

function displayAvailableRoomsView() {
  hide(guestPortalView)
  unhide(availableRoomsView)
  unhide(roomForm)
}

function hide(element) {
  element.classList.add('hidden')
}

function unhide(element) {
  element.classList.remove('hidden')
}

console.log('This is the JavaScript entry file - your code begins here.')