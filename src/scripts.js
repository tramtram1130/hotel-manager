// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/bathhouse.png'

// GLOBAL VARIABLES

let roomsData
let customersData
let bookingsData
let currentUser

// API CALLS

const gatherData = (url) => {
  return fetch(url)
    .then(response => response.json)
    .catch(err => console.log(err))
}

const instantiateData = () => {
  Promise.all([
    gatherData(),
    gatherData(),
    gatherData()
  ])
    .then(data => {
      
    })
}


console.log('This is the JavaScript entry file - your code begins here.');
