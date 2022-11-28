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
  let searchLat = response.data.coordinates.latitude;
  let searchLon = response.data.coordinates.longitude;
  handleSubmitForecast(searchLat, searchLon);

  let icon = document.querySelector("#icon");

  celciusTemp = response.data.temperature.current;

  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.temperature.humidity}%`;
  document.querySelector("#wind-speed").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/hr`;
  document.querySelector("#weather-description-main").innerHTML =
    response.data.condition.description;
  document.querySelector("#temperature").innerHTML = `${Math.round(
    celciusTemp
  )}`;
  document.querySelector("#current-date").innerHTML = formatDate(
    response.data.time * 1000
  );
  document.querySelector("#current-time").innerHTML = formatTime(
    response.data.time * 1000
  );
  icon.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
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

function getLocalWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoords);
}

function getCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let gpsUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}`;

  axios.get(gpsUrl).then(displayWeather);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemp = (celciusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  fahrenheitLink.classList.add("active");
  celciusLink.classList.remove("active");
}

function displayCelciusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celciusTemp);
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function handleSubmitForecast(lat, lon) {
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${lat}&lon=${lon}&key=${apiKey}&units=metric`;

  axios.get(forecastUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  for (i = 1; i < 7; i++) {
    let apiResponse = response.data.daily[i];
    let daysIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let forecastTimestamp = apiResponse.time * 1000;
    let forecastDay = new Date(forecastTimestamp);
    forecastDay = forecastDay.getDay();

    forecastHTML =
      forecastHTML +
      `
      <div class="col">
      <div class="forecast-day">${daysIndex[forecastDay]}</div>
      <div>
      <img src="${apiResponse.condition.icon_url}" alt="${
        apiResponse.condition.icon
      }" class="forecast-icon" />
      </div>
      <div class="forecast-temp">${Math.round(
        apiResponse.temperature.day
      )}°C</div>
        <div class="forecast-description">${
          apiResponse.condition.description
        }</div>
        </div>`;
  }
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let apiKey = "a12e1c2t3a5fde8c3o498d0228b3eb28";

let form = document.querySelector("#search-city");
form.addEventListener("submit", handleSubmitSearch);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getLocalWeather);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemp);

let celciusTemp = null;

searchCity("toronto");
