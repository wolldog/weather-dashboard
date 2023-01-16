const citySearchInput = document.querySelector("#inputSearch");
const citySearchBtn = document.querySelector("#search");
let citySearch = '';

const apiKey = "11b8a1814454ad6bc0b2f293df9f1ff0";

//When 'Search' button is clicked
//1. the default behaviour of button is prevented
//2. the value is trimmed of any white space and saved to variable 'city'
//3. the value is logged to console
//4. the input is removed from the input box
//5. the function 'getCityCoordinates' is called

citySearchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    citySearch = citySearchInput.value.trim();
    console.log(citySearch);
    citySearchInput.value = "";
    getCityCoordinates();
  });
  
  function getCityCoordinates() {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=metric&APPID=${apiKey}`;
  
    fetch(apiURL).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          getCityForecast(data.coord.lat, data.coord.lon);
        });
      } else {
        alert("Error: " + response.statusText);
        //To do: Make this meaningful
      }
    });
  }
  
  function getCityForecast(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
    fetch(apiURL).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          saveSearch(citySearch);
          let forecast = [data.list];
          displayCurrentWeather(data.list[0], data.city.name);
        });
      }
    });
  }

  function displayCurrentWeather(current, cityName) {
    const iconURL = `http://openweathermap.org/img/wn/${current.weather[0].icon}.png`;
    const dateToday = dayjs.unix(current.dt).format("DD/MM/YY");
    const weatherIcon = document.getElementById("current-icon");
    const tempToday = current.main.temp;
    const windToday = current.wind.speed;
    const humidityToday = current.main.humidity;
  
    // clear current weather icon
    weatherIcon.textContent = "";
  
    // create img element
    const imgEl = document.createElement("img");
  
    //set image source to iconURL
    imgEl.setAttribute("src", iconURL);
  
    // add this icon to html element 'weatherIcon'
    weatherIcon.appendChild(imgEl);
  
    document.getElementById("current").textContent =
      cityName + " (" + dateToday + ") ";
    document.getElementById("tempToday").textContent = tempToday + "°F";
    document.getElementById("windToday").textContent = windToday + "MPH";
    document.getElementById("humidityToday").textContent = humidityToday + "%";
  }
  
  function saveSearch(city) {
    let citySearchHistory = [];
    let savedCitySearch = JSON.parse(localStorage.getItem("mySavedSearch"));
    if (savedCitySearch !== null) {
      citySearchHistory = savedCitySearch;
    }
  
    var index = citySearchHistory.findIndex(function (cityHistory) {
      return cityHistory.toLowerCase() === city.toLowerCase();
    });
  
    if (index >= 0) {
      console.log("duplicate");
    } else {
      citySearchHistory.unshift(city);
      localStorage.setItem("mySavedSearch", JSON.stringify(citySearchHistory));
      addSearchBtn(city);
    }
  }

  function addSearchBtn(city) {
    var searchButtonList = document.querySelector("#searchButtonList");
    var buttonEl = document.createElement("button");
  
    buttonEl.textContent = city.charAt(0).toUpperCase() + city.substr(1);
    buttonEl.classList.add("btn");
    buttonEl.classList.add("btn-primary");
    buttonEl.setAttribute("type", "button");
    buttonEl.setAttribute("data-search", city);
    buttonEl.addEventListener("click", function () {
      citySearch = this.dataset.search;
      getCityCoordinates();
    });
    //Append new search button to the top of the list
    searchButtonList.insertBefore(buttonEl, searchButtonList.firstChild);
  }