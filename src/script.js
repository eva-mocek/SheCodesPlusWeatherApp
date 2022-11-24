// Day
// update to consider time zones
let now = new Date();
let currentDate = document.querySelector("#current-date");

function formatDate(now) {
  let dayIndex = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let monthIndex = [
    "Januray",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${dayIndex[now.getDay()]}, ${monthIndex[now.getMonth()]}
  ${now.getDate()}`;
}
currentDate.innerHTML = formatDate(now);

// Time
// update to consider time zones
let currentTime = document.querySelector("#current-time");
let amPm = document.querySelector("#am-pm");
let hours = now.getHours();

function formatTime(time) {
  if (hours === 0) {
    hours = 12;
  }
  if (hours > 0 && hours < 10) {
    hours = `0${hours}`;
  }
  if (hours > 12) {
    hours = hours - 12;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (now.getHours() <= 12) {
    amPm.innerHTML = "am";
  } else {
    amPm.innerHTML = "pm";
  }

  return `${hours}:${minutes}`;
}

currentTime.innerHTML = formatTime(now);

/*
SEARCH
user enters a city
api call - use input city to get lat & long coords
api call - use lat & long to get weather data
display weather data

CURRENT
gets user location data
api call - use location to get lat & long coords
api call - use lat & long to get weather data
display weather data
*/

// Search Bar - submit event
let form = document.querySelector("#search-city");
form.addEventListener("submit", updateCity);

// Current Weather Button - click event
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", showLocalWeather);

let apiKey = "d583b033935a0872b3f66c9a92145b16";

// Updates City with user input
function updateCity(event) {
  event.preventDefault();
  let input = document.querySelector("#input-city");
  document.querySelector("#city").innerHTML = input.value.trim();
  let cityString = input.value.trim();
  getLatLong(cityString);
}

// API Calls

// API - gets latitude and longitude of city searhed by user
async function getLatLong(cityString) {
  let geoUrl = "https://api.openweathermap.org/geo/1.0/direct?";
  let response = await axios.get(
    `${geoUrl}q=${cityString}&limit=1&appid=${apiKey}`
  );
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  updateCityWeather(latitude, longitude);
}

// API - Pulls weather data from user-entered city
function updateCityWeather(lat, lon) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

  axios
    .get(`${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(updateWeather);
}

// Updates weather data for user-entered City
function updateWeather(response) {
  document.querySelector("#temperature").innerHTML = `${Math.round(
    response.data.main.temp
  )}°C`;
  // add link that toggles between °C and °F
  document.querySelector("#humidity").innerHTML = `${Math.round(
    response.data.main.humidity
  )}%`;
  document.querySelector("#wind-speed").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/hr`;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].main;
}

// Current Local Weather (Button)

function showLocalWeather(event) {
  navigator.geolocation.getCurrentPosition(showLocation);

  function showLocation(position) {
    console.log(position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    updateCityWeather(lat, lon);
    getLocalWeather(lat, lon);
  }

  function getLocalWeather(lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
    axios
      .get(`${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(updateLocalCity);
  }
}

function updateLocalCity(response) {
  document.querySelector("#city").innerHTML = response.data.name;
}

updateCityWeather(43.6534817, -79.3839347); //Toronto, ON, Canada
