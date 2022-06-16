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

var currentCity;

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

    return cityName;
};

var getCityCoordinates = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q="
    + cityName 
    + "&limit=1&appid="
    + appKey;
    var citySearch = JSON.parse(localStorage.getItem("cities")) || [];
    var cityInfo = {
        city: "",
        lat: "",
        long: ""
    };
    fetch(apiUrl)
        .then(function(response) {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function(data) {
                var cityInfo = {
                city: cityName,
                lat: data[0].lat,
                long: data[0].lon
            }

            citySearch.push(cityInfo);
            localStorage.setItem("cities", JSON.stringify(citySearch));

            displaySearchHistory();

            return cityInfo;
        })
        .then(function(data) {
            getCurrentCityWeather(data);
        })
        return;
};

var getCurrentCityWeather = function(data) {
    
    console.log(data);
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.lat + "&lon=" + data.long + "&exclude=minutely,hourly,alerts&units=imperial&appid="
    + appKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        displayCityWeather(data)
    });
};

var displayCityWeather = function(data) {
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

    var cityName = document.getElementById("city").value;
    cityNameEl.innerText = cityName;
    currentDateEl.innerText = "(" + date + ")";
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

    for (var i = 1; i <= 5; i++) {
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

var displaySearchHistory = function() {
    var citySearch = JSON.parse(localStorage.getItem("cities")) || [];
    
    citySearchHistory.innerHTML = "";

    for (i = 0; i < citySearch.length; i++) {
        var prevCityBtn = document.createElement("button");
        prevCityBtn.classList.add("btn", "btn-primary", "m-2", "past-city");
        prevCityBtn.textContent = citySearch[i].city;
        citySearchHistory.appendChild(prevCityBtn);
    };
};

var clearCurrentCityWeather = function() {
    var cityNameEl = document.getElementById("cityName");
    cityNameEl.innerText = "";
    
    var currentDateEl = document.getElementById("currentDate");
    currentDateEl.innerText = "";

    var tempEl = document.querySelector(".temp");
    tempEl.innerText = "";

    var humidityEl = document.querySelector(".humidity");
    humidityEl.innerText = "";

    var windSpeedEl = document.querySelector(".wind_speed");
    windSpeedEl.innerText = "";

    var uvIndexEl = document.querySelector(".uvi");
    uvIndexEl.innerText = "";

    var fiveDayHeaderEl = document.getElementById('fiveDayHeader');
    fiveDayHeaderEl.innerText = "";

    var futureForecaseEl = document.getElementById('future-forecast');
    futureForecaseEl.innerText = "";
};

var getPreviousCity = function(event) {
    var cityEl = event.target;

    if (cityEl.matches(".past-city")) {
        cityName = cityEl.textContent;
        
        clearCurrentCityWeather();

        getCityCoordinates(cityName);
    }
};

displaySearchHistory();

citySearchHistory.addEventListener("click", getPreviousCity);

cityFormEl.addEventListener("submit", citySubmissionHandler);