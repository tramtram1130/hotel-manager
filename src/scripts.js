// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
import Customer from './classes/Customer.js'
import Room from './classes/Room.js'
import Booking from './classes/Booking.js'

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
const checkAvailabilityButton = document.querySelector('.check-availibility-button')

// EVENT LISTENERS

window.addEventListener('load', instantiateData)
guestPortalButton.addEventListener('click', displayGuestPortal)
checkAvailabilityButton.addEventListener('click', getAvailableRooms)

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
      bookingsData = data[2].bookings
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
  currentUser.getPastBookings(bookingsData)
  currentUser.getFutureBookings(bookingsData)
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
  console.log(dateForm.value)
  let sample = (new Date(bookingsData[0].date).toISOString()).split('T')[0]
  console.log(sample)
  console.log(bookingsData)
  if (dateForm.value > sample) {
    console.log('Hallo')
  }
}

function tidyUpDateForm() {
  dateForm.setAttribute('value', today)
  dateForm.setAttribute('min', today)
}

function displayGuestPortal() {
  unhide(guestPortalView)
}

function hide(element) {
  element.classList.add('hidden')
}

function unhide(element) {
  element.classList.remove('hidden')
}

console.log('This is the JavaScript entry file - your code begins here.')