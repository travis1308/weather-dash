var cityFormEl = document.getElementById("city-form");
var cityInputEl = document.getElementById("city");
var cityWxEl = document.getElementById("city-wx");
var timezoneEl = document.querySelector(".timezone");
var currentDateEl = document.getElementById("currentDate");
var tempEl = document.querySelector(".temp");
var humidityEl = document.querySelector(".humidity");
var windSpeedEl = document.querySelector(".wind_speed");
var uvIndexEl = document.querySelector(".uvi");
var iconEl = document.querySelector(".icon");
var appKey = "de8abe91cabf5ea9e7d6f8265f339520";
var lat = null;
var long = null;
var citySearchHistory = document.getElementById("search-history");

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
    + "&exclude=minutely,hourly,alerts&units=imperial&appid="
    + appKey)
    .then(response => response.json())
    .then((data) => displayCityWeather(data))
    // .then((data) => displayFutureCityWeather(data));
};

var displayCityWeather = function(data) {
    var city = data.timezone;
    var currentWxIcon = data.current.weather[0].icon;
    var currentWxTemp = data.current.temp;
    var currentHumidity = data.current.humidity;
    var currentWind = data.current.wind_speed;
    var currentUVI = data.current.uvi;
    
    var date = data.current.dt;
    var date = moment.unix(date).format("MM/DD/YYYY");
    var uvIndexSpanEl = document.createElement("span");


    timezoneEl.innerText = "Weather in " + city;
    currentDateEl.innerHTML = "(" + date + ")";
    tempEl.innerText = "Temp: " + currentWxTemp + "°F";
    humidityEl.innerText = "Humidity: " + currentHumidity + "%";
    windSpeedEl.innerText = "Wind: " + currentWind + " MPH";
    uvIndexEl.innerText = "UV Index: " + currentUVI;
    iconEl.src = "https://openweathermap.org/img/wn/" + currentWxIcon + ".png";

    var fiveDayHeaderEl = document.getElementById("fiveDayHeader");
    var fiveDayEl = document.createElement("h3");
    fiveDayEl.textContent = "5-Day Forecast: ";
    fiveDayHeaderEl.append(fiveDayEl);
    
    var futureForecast = document.getElementById("future-forecast");

    for (var i = 0; i < 5; i++) {
        var date;
        var temp;
        var icon;
        var wind;
        var humidity;

        date = data.daily[i].dt;
        date = moment.unix(date).format("MM/DD/YYYY");

        temp = Math.round(data.daily[i].temp.day);
        icon = data.daily[i].weather[0].icon;
        wind = Math.round(data.daily[i].wind_speed);
        humidity = data.daily[i].humidity;

        var dailyWxEl = document.createElement("div");
        dailyWxEl.classList = "card col-2 m-1 bg-dark text-white";

        var dailyWxCardEl = document.createElement("div");
        dailyWxCardEl.classList = "card-body";
        dailyWxCardEl.innerHTML =   `<h6>${date}</h6>
                                    <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>
                                    ${temp}°F<br>
                                    ${wind} MPH <br>
                                    ${humidity}%`
        dailyWxEl.appendChild(dailyWxCardEl);
        futureForecast.append(dailyWxEl);

    };
};


cityFormEl.addEventListener("submit", citySubmissionHandler);