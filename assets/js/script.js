var cityFormEl = document.getElementById("city-form");
var cityInputEl = document.getElementById("city");
var cityWxEl = document.getElementById("city-wx");
var currentDateEl = document.getElementById("currentDate");
var tempEl = document.querySelector(".temp");
var humidityEl = document.querySelector(".humidity");
var windSpeedEl = document.querySelector(".wind_speed");
var uvIndexEl = document.querySelector(".uvi");
var iconEl = document.querySelector(".icon");
var cityNameEl = document.getElementById("cityName");
var appKey = "de8abe91cabf5ea9e7d6f8265f339520";
var lat = null;
var long = null;
var citySearchHistory = document.getElementById("search-history");
var dateTimeEl = document.getElementById('dateTime');
let cityName = null;

var citySubmissionHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value;

    clearCurrentCityWeather();

    if (cityName) {
        getCityCoordinates(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    };

    return;
};

var getCityCoordinates = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q="
    + city 
    + "&limit=1&appid="
    + appKey;
    var citySearch = JSON.parse(localStorage.getItem("cities")) || [];


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
};

var displayCityWeather = function(data, cityName) {
    cityWxEl.prepend(cityNameEl);
    
    var currentWxIcon = data.current.weather[0].icon;
    var currentWxTemp = data.current.temp;
    var currentHumidity = data.current.humidity;
    var currentWind = data.current.wind_speed;
    var currentUVI = data.current.uvi;
    
    var date = data.current.dt;
    var date = moment.unix(date).format("MM/DD/YYYY");
    var uvIndexSpanEl = document.createElement("span");
    uvIndexEl.append(uvIndexSpanEl);

    cityNameEl.innerText = "Weather in " + cityName;
    currentDateEl.innerHTML = "(" + date + ")";
    tempEl.innerText = "Temp: " + currentWxTemp + "°F";
    humidityEl.innerText = "Humidity: " + currentHumidity + "%";
    windSpeedEl.innerText = "Wind: " + currentWind + " MPH";
    uvIndexSpanEl.innerText = "UV Index: "+ currentUVI;
    iconEl.src = "https://openweathermap.org/img/wn/" + currentWxIcon + ".png";

    if (currentUVI < 3) {
        $(uvIndexSpanEl).css({'background-color':'green', 'color':'white'});
    } else if (currentUVI < 6) {
        $(uvIndexSpanEl).css({'background-color':'yellow', 'color':'white'});
    } else if (currentUVI < 8) {
        $(uvIndexSpanEl).css({'background-color':'orange', 'color':'white'});
    } else if (currentUVI < 11) {
        $(uvIndexSpanEl).css({'background-color':'red', 'color':'white'});
    } else {
        $(uvIndexSpanEl).css({'background-color':'violet', 'color':'white'});
    };

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
                                    Temp: ${temp}°F<br>
                                    Wind: ${wind} MPH <br>
                                    Humidity: ${humidity}%`
        dailyWxEl.appendChild(dailyWxCardEl);
        futureForecast.append(dailyWxEl);

    };
};

var clearCurrentCityWeather = function() {
    var cityNameEl = document.getElementById("cityName");
    cityNameEl.innerHTML = "";
    
    var currentDateEl = document.getElementById("currentDate");
    currentDateEl.innerHTML = "";

    var tempEl = document.querySelector(".temp");
    tempEl.innerText = "";

    var humidityEl = document.querySelector(".humidity");
    humidityEl.innerText = "";

    var windSpeedEl = document.querySelector(".wind_speed");
    windSpeedEl.innerText = "";

    var uvIndexEl = document.querySelector(".uvi");
    uvIndexEl.innerText = "";

    var fiveDayHeaderEl = document.getElementById('fiveDayHeader');
    fiveDayHeaderEl.innerHTML = "";

    var futureForecaseEl = document.getElementById('future-forecast');
    futureForecaseEl.innerHTML = "";
};

cityFormEl.addEventListener("submit", citySubmissionHandler);