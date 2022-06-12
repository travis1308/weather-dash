var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var cityWxEl = document.querySelector("#city-wx");
var timezoneEl = document.querySelector(".timezone");
var currentDateEl = document.querySelector("#currentDate");
var tempEl = document.querySelector(".temp");
var humidityEl = document.querySelector(".humidity");
var windSpeedEl = document.querySelector(".wind_speed");
var uvIndexEl = document.querySelector(".uvi");
var iconEl = document.querySelector(".icon");
var appKey = "de8abe91cabf5ea9e7d6f8265f339520";
var lat = null;
var long = null;
var date = moment().format("MM/DD/YYYY");
var forecastEl = document.querySelector("#forecast");

var citySubmissionHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityCoordinates(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    };
};

var getCityCoordinates = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q="
    + city 
    + "&limit=1&appid="
    + appKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then((data) => showCityCoordinates(data));
};

var showCityCoordinates = function(data) {
    var lat = data[0].lat;
    var long = data[0].lon;
    getCurrentCityWeather(lat,long);
};

var getCurrentCityWeather = function(lat, long) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat="
    + lat
    + "&lon="
    + long
    + "&exclude=minutely,hourly&units=imperial&appid="
    + appKey)
    .then(response => response.json())
    .then((data) => displayCurrentCityWeather(data))
    .then((data) => displayFutureCityWeather(data));
};

var displayCurrentCityWeather = function(data) {
    const { timezone } = data;
    const { icon } = data.current.weather[0];
    const { temp, humidity, wind_speed } = data.current;
    const { uvi } = data.current;
    timezoneEl.innerText = "Weather in " + timezone;
    currentDateEl.innerHTML = "(" + date + ")";
    tempEl.innerText = "Temp: " + temp + "°F";
    humidityEl.innerText = "Humidity: " + humidity + "%";
    windSpeedEl.innerText = "Wind: " + wind_speed + " MPH";
    uvIndexEl.innerText = "UV Index: " + uvi;
    iconEl.src = "https://openweathermap.org/img/wn/" + icon + ".png";
};

var displayFutureCityWeather = function(data) {
    


    for (i = 0; i < 5; i++) {
        const { icon } = data.daily[i].weather[0];
        const { day } = data.daily[i].temp;
        const { humidity } = data.daily[i];
        const { wind_speed } = data.daily[i];
        var dailyWxEl = document.createElement("div");
        dailyWxEl.classList = "bg-dark text-white";

        forecastEl.appendChild(dailyWxEl);
    };

};

cityFormEl.addEventListener("submit", citySubmissionHandler);