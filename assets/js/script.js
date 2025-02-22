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

//Fetch the coordinates of the city entered in the search input
//Call 'getCityForecast
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

//Use the coordinates to fetch the  weather forecast data
//Call displayForecast (5 day forecast)
//Call displayCurrentWeather (current weather)
function getCityForecast(lat, lon) {
var apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

fetch(apiURL).then(function (response) {
    if (response.ok) {
    response.json().then(function (data) {
        console.log(data);
        saveSearch(citySearch);
        let forecast = [data.list];
        displayForecast(...forecast);
        displayCurrentWeather(data.list[0], data.city.name);
    });
    }
});
}

//Function populates the current weather 
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

//Function takes search input and checks for an existing entry for that city.
function saveSearch(city) {
    let citySearchHistory = [];
    let savedCitySearch = JSON.parse(localStorage.getItem("mySavedSearch"));
    if (savedCitySearch !== null) {
        citySearchHistory = savedCitySearch;
    }
    //findIndex used to locate any duplicates and returns the index if duplicate found.
    //by changing saved and input to lowercase it avoids duplicates even if entered with 
    //a different capital or lowercase letters
    var index = citySearchHistory.findIndex(function (cityHistory) {
        return cityHistory.toLowerCase() === city.toLowerCase();
    });

    //if findIndex returns 0 or greater, there is a current record for the city input 
    //and current search is not saved
    if (index >= 0) {
        console.log("duplicate");

    //if findIndex returns -1, there is no current record for the city
    //input is saved and a 'addSearchBtn is called
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
    buttonEl.setAttribute("class", "btn saved-search");
    // buttonEl.classList.add("btn-primary");
    buttonEl.setAttribute("type", "button");
    buttonEl.setAttribute("data-search", city);
    buttonEl.addEventListener("click", function () {
      citySearch = this.dataset.search;
      getCityCoordinates();
    });
    //Append new search button to the top of the list
    searchButtonList.insertBefore(buttonEl, searchButtonList.firstChild);
  }

function displayForecast(list) {
    
    const fiveDays = document.getElementById("fiveDayForecast");
  
    //Clear content of 'fiveDays' div ready for new data
    fiveDays.textContent = "";
    
    //Create elements and display 5 day forecast
    for (let i = 7; i < list.length; i += 8) {
      const date = dayjs.unix(list[i].dt).format("DD/MM/YY");
      const temp = list[i].main.temp;
      const wind = list[i].wind.speed;
      const humidity = list[i].main.humidity;
      const iconURL = `http://openweathermap.org/img/wn/${list[i].weather[0].icon}.png`;
  
      const divColEl = document.createElement("div");
      const divCardEl = document.createElement("div");
      const divCardBodyEl = document.createElement("div");
      const h3El = document.createElement("h3");
      const paraEl1 = document.createElement("p");
      const paraEl2 = document.createElement("p");
      const paraEl3 = document.createElement("p");
      const imgEl = document.createElement("img");
  
      divColEl.setAttribute("class", "col");
      divCardEl.setAttribute("class", "card");
      divCardBodyEl.setAttribute("class", "card-body text-white");
      divCardBodyEl.setAttribute("data-index", i);
      h3El.textContent = date;
      imgEl.src = iconURL;
      paraEl1.textContent = `Temp: ${temp}°F`;
      paraEl2.textContent = `Wind: ${wind}MPH`;
      paraEl3.textContent = `Humidity: ${humidity}%`;
      
  
      fiveDays.appendChild(divColEl);
      divColEl.appendChild(divCardEl);
      divCardEl.appendChild(divCardBodyEl);
      divCardBodyEl.appendChild(h3El);
      divCardBodyEl.appendChild(imgEl);
      divCardBodyEl.appendChild(paraEl1);
      divCardBodyEl.appendChild(paraEl2);
      divCardBodyEl.appendChild(paraEl3);
  
      console.log(date, iconURL, temp, wind, humidity);
    }
  }

  //Function to display the saved search buttons on page load
  //by passing data to 'addSearchButton'
  //Calls 'displayLastSearch'
  function displaySavedSearch() {
    const savedSearchArray =
      JSON.parse(localStorage.getItem("mySavedSearch")) || [];
  
    if (savedSearchArray.length > 0) {
      savedSearchArray.reverse().forEach(function (cityName) {
        addSearchBtn(cityName);
        displayLastSearch();
      });
    }
  }
  
  //Function displays the top first entry (last saved) on page load
  function displayLastSearch() {
    const savedSearchArray =
      JSON.parse(localStorage.getItem("mySavedSearch")) || [];
  
    if (savedSearchArray.length > 0) {
      citySearch = savedSearchArray[0];
      getCityCoordinates();
    }
  }
  
  //Call to displaySavedSearch on page load
  displaySavedSearch();