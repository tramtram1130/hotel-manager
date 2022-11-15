import './css/styles.css';
import Customer from './classes/Customer.js'
import Room from './classes/Room.js'
import AllBookings from './classes/Booking.js'
import './images/bathhouse.png'
import './images/no-face.gif'

// GLOBAL VARIABLES

let customersData
let roomsData
let bookingsData
let currentUser
let today = ((new Date()).toISOString()).split('T')[0]

// QUERY SELECTORS

const loginView = document.querySelector('.login-container')
const usernameField = document.querySelector('#username')
const passwordField = document.querySelector('#password')
const loginButton = document.querySelector('.login-button')
const loginErrorMessage = document.querySelector('.login-error-message')
const homeView = document.querySelector('.greeting-container')
const guestPortalView = document.querySelector('.guest-portal-container')
const guestPortalButton = document.querySelector('.guest-portal-button')
const pastBookings = document.querySelector('.past-bookings-body') 
const futureBookings = document.querySelector('.future-bookings-body')
const totalSpending = document.querySelector('.spending-title')
const dateForm = document.querySelector('.date-form')
const roomForm = document.querySelector('.room-form')
const checkDateAvailabilityButton = document.querySelector('.check-date-availability-button')
const checkRoomAvailabilityButton = document.querySelector('.check-room-availability-button')
const apologyMessage = document.querySelector('.apology-title')
const bookedMessage = document.querySelector('.booked-message-title')
const availableRoomsView = document.querySelector('.available-rooms-container')
const availableRoomsTitle = document.querySelector('.available-rooms-title')
const availableRoomsDisplay = document.querySelector('.available-rooms-body')

// EVENT LISTENERS

window.addEventListener('load', () => instantiateData('load'))
loginButton.addEventListener('click', logIn)
guestPortalButton.addEventListener('click', displayGuestPortalView)
checkDateAvailabilityButton.addEventListener('click', getAvailableRooms)
checkRoomAvailabilityButton.addEventListener('click', filterByRoomTypes)

// API CALLS

const gatherData = (url) => {
  return fetch(url)
    .then(response => response.json())
    .catch(err => console.log(err))
}

function instantiateData(condition) {
  Promise.all([
    gatherData('http://localhost:3001/api/v1/customers'),
    gatherData('http://localhost:3001/api/v1/rooms'),
    gatherData('http://localhost:3001/api/v1/bookings')
  ]).then(data => {
      customersData = data[0].customers
      roomsData = data[1].rooms
      bookingsData = new AllBookings(data[2].bookings)
      if (condition === 'update') {
        populateDashboard(bookingsData)
      }
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
  .then(() => instantiateData('update'))
  .then(() => displaySuccessfulBooking())
  .catch(err => console.log(err))
}

function logIn(event) {
  event.preventDefault()
  let guestUserNameInput = usernameField.value
  let guestPasswordInput = passwordField.value
  let firstEightChar = guestUserNameInput.slice(0, 8)
  let lastTwoChar = guestUserNameInput.slice(8)
  let filteredCustomer = customersData.filter(customer => customer.id === parseInt(lastTwoChar))
  if (firstEightChar === 'customer' && 
    !(/\s/.test(guestUserNameInput)) &&
    parseInt(lastTwoChar) < 51 &&
    parseInt(lastTwoChar) != 0 &&
    guestPasswordInput === 'overlook2021') {
      renderUser(filteredCustomer)
      displayHomeView()
    } else {
      unhide(loginErrorMessage)
    }
}

function renderUser(guest) {
  currentUser = new Customer(guest[0])
  populateDashboard(bookingsData)
  tidyUpDateForm()
}

function populateDashboard(bookingsData) {
  currentUser.getPastBookings(bookingsData.bookings)
  currentUser.getFutureBookings(bookingsData.bookings)
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
  let availableRooms = bookingsData.getAvailableRooms(roomsData, unavailableRooms)
  displayApologyMessage(availableRooms)
  return availableRooms
}

function filterByRoomTypes() {
  let availableRooms = getAvailableRooms()
  let filteredAvailableRooms = availableRooms.filter(room => {
    if (room.roomType === roomForm.value) {
      return room
    }
  })
  displayApologyMessage(filteredAvailableRooms)
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
  let bookedRoomNum = event.target.value
  let newBooking = { userID: currentUser.id, date: (dateForm.value).split('-').join('/'), roomNumber: parseInt(bookedRoomNum) }
  postData(newBooking)
}

function tidyUpDateForm() {
  dateForm.setAttribute('value', today), dateForm.setAttribute('min', today)
}

function displayApologyMessage(list) {
  if (list.length === 0) {
    apologyMessage.classList.remove('hidden')
    renderAvailableRooms(list)
  } else {
    apologyMessage.classList.add('hidden')
    renderAvailableRooms(list)
  }
}

function displayHomeView() {
  hide(loginView)
  unhide(homeView)
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