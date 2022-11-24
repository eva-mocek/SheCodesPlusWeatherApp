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

// Search Bar - submit event
let form = document.querySelector("#search-city");
form.addEventListener("submit", updateCity);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", showLocalWeather);

// Updates City with user input
function updateCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city");

  let input = document.querySelector("#input-city");
  city.innerHTML = input.value.trim();

  let cityString = input.value.trim();
  getLatLong(cityString);
}

// API
let apiKey = "d583b033935a0872b3f66c9a92145b16";

// API - gets latitude and longitude of city searhed by user
async function getLatLong(cityString) {
  console.log(cityString);

  let geoUrl = "https://api.openweathermap.org/geo/1.0/direct?";

  let response = await axios.get(
    `${geoUrl}q=${cityString}&limit=1&appid=${apiKey}`
  );

  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;

  console.log(latitude);
  console.log(longitude);
  updateCityWeather(latitude, longitude);
}

// API - Pulls weather data from user-entered city
function updateCityWeather(lat, lon) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

  axios
    .get(`${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(updateWeather);
}

// Updates App with user-entered City
function updateWeather(response) {
  console.log(response);

  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}°C`;
  // add link that toggles between °C and °F

  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity}%`;

  let windSpeed = Math.round(response.data.wind.speed * 3.6);
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerHTML = `${windSpeed} km/hr`;

  let description = response.data.weather[0].main;
  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = `${description}`;
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
  console.log(response);
  let cityLocal = document.querySelector("#city");
  cityLocal.innerHTML = response.data.name;
}
