let apiKey = "a12e1c2t3a5fde8c3o498d0228b3eb28";

function formatDate(timestamp) {
  let now = new Date(timestamp);

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

  return `${dayIndex[now.getDay()]}, ${
    monthIndex[now.getMonth()]
  } ${now.getDate()}`;
}

function formatTime(timestamp) {
  let now = new Date(timestamp);
  let amPm = document.querySelector("#am-pm");
  let hours = now.getHours();

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

function displayWeather(response) {
  let icon = document.querySelector("#icon");
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.temperature.humidity}%`;
  document.querySelector("#wind-speed").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/hr`;
  document.querySelector("#weather-description").innerHTML =
    response.data.condition.description;
  document.querySelector("#temperature").innerHTML = `${Math.round(
    response.data.temperature.current
  )}`;
  document.querySelector("#current-date").innerHTML = formatDate(
    response.data.time * 1000
  );
  document.querySelector("#current-time").innerHTML = formatTime(
    response.data.time * 1000
  );
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  icon.setAttribute("alt", response.data.condition.description);
}

function searchCity(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function handleSubmitSearch(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#input-city");
  searchCity(inputCity.value.trim());
}

searchCity("toronto");

let form = document.querySelector("#search-city");
form.addEventListener("submit", handleSubmitSearch);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", showLocalWeather);

function showLocalWeather(event) {
  navigator.geolocation.getCurrentPosition(showLocation);
}

function showLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let gpsUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}`;

  axios.get(gpsUrl).then(displayWeather);
}
