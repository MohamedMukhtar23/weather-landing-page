// vars

var county_name = document.getElementById("county-name");
var symbol_icon_main = document.getElementById("symbol-icon-main");
var degree_main = document.getElementById("degree-main");
var main_state = document.getElementById("main-state");
var today = document.querySelector(".today");
let searchValue = document.querySelector(".search-item");

// formationg date
const formatDate = (dateString) => {
  const date = new Date(dateString); // Convert string to Date object

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
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

  const dayName = dayNames[date.getDay()]; // Get day name
  const day = date.getDate(); // Get day of the month
  const month = monthNames[date.getMonth()]; // Get month name

  return [dayName, day, month];
};

// to get the weather with city or lon and lat
async function fetchWeather(query) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=af193c4729e043b0ab5141746231907&q=${query}&days=3`
  );
  const data = await response.json();
  return data;
}

// applay current location by geolocation
async function getWeatherForCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const data = await fetchWeather(`${latitude},${longitude}`);

          updateDOM(data);

          // console.log("data of dom updated");
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not retrieve location. Please check your permissions.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
getWeatherForCurrentLocation();

// update dom data
function updateDOM(data) {
  const forcast = data.forecast.forecastday;
  const current = data.current;
  const location = data.location;

  console.log("the datat logged from here is the fute one");

  console.log(" forcast datat is", data);
  console.log("forecast", forcast);
  console.log("location from future");

  console.log("current from future", current);

  // const finalDate = formatDate(current.last_updated);

  const colortext = getColor(current.condition.code);
  const weatherState = current.condition.text;
  const current_date = current.last_updated.split(" ");
  const final_date = formatDate(current_date);

  // Update dom details of current
  today.querySelector("#county-name").innerHTML = location.name;
  today.querySelector("#symbol-icon-main").src =
    "https:" + current.condition.icon;
  today.querySelector("#degree-main").innerHTML = current.temp_c + "°C";
  today.querySelector("#main-state").innerHTML = current.condition.text;
  today.querySelector("#main-state").style.color = colortext;
  today.querySelector("#humitity").childNodes[1].nodeValue =
    current.humidity + "%";
  today.querySelector("#wind-speed").childNodes[1].nodeValue =
    current.wind_kph + "km/h";
  today.querySelector(".day").innerHTML = final_date[0];
  today.querySelector(".month").innerHTML = final_date[1] + " " + final_date[2];

  // i want to update the curremt from the future

  let next_day = document.querySelectorAll(".next-day");

  for (var i = 0; i < next_day.length; i++) {
    const date = forcast[i + 1].date;
    const formattedDate1 = formatDate(date);

    let textColor = getColor(forcast[i + 1].day.condition.code);
    next_day[i].querySelector(".day").innerHTML = formattedDate1[0]; // Day name (e.g., Saturday)
    next_day[i].querySelector(".month").innerHTML =
      formattedDate1[1] + " " + formattedDate1[2]; // Date and Month (e.g., 30 November)

    next_day[i].querySelector(".symbol-icon").src =
      "https:" + forcast[i + 1].day.condition.icon;
    next_day[i].querySelector(".degree").innerHTML =
      forcast[i + 1].day.maxtemp_c + "°C";
    next_day[i].querySelector(".state").innerHTML =
      forcast[i + 1].day.condition.text;
    next_day[i].querySelector(".state").style.color = textColor;
    next_day[i].querySelector(".wind-dir").childNodes[1].nodeValue = windDir(
      current.wind_dir
    );
    next_day[i].querySelector(".humitity").childNodes[1].nodeValue =
      forcast[i + 1].day.avghumidity + "%";
    next_day[i].querySelector(".wind-speed").childNodes[1].nodeValue =
      forcast[i + 1].day.maxwind_kph + "km/h";
  }

  // Update video background
  updateWeatherState(weatherState);
}

// search function
searchValue.addEventListener("input", async function (event) {
  let element = searchValue.value.trim();
  if (element.length > 0) {
    const data = await fetchWeather(`${element}`);
    // console.log("data from search data",data);
    updateDOM(data);
    console.log("data dom updated from search data");
  }
  if (element.length == 0) {
    getWeatherForCurrentLocation();
  }
});

const videoElement = document.getElementById("background-video");

// update bg based on weather
function updateWeatherState(weatherState) {
  let videoSrc = document.getElementById("video_src").getAttribute("src");

  console.log(videoSrc);

  if (weatherState === "Patchy rain possible") {
    videoSrc = "assets/rainy.mp4";
  } else if (weatherState === "Mist") {
    console.log("hh");

    videoSrc = "assets/mist.mp4";
    console.log("hello2");
  } else if (weatherState === "Sunny") {
    videoSrc = "assets/sunny.mp4";
  } else if (weatherState === "Clear") {
    videoSrc = "assets/sunny.mp4";
  } else if (weatherState == "Partly cloudy") {
    videoSrc = "assets/cloudy.mp4";
  } else {
    videoSrc = "assets/1844-150885307_small.mp4";
  }

  document.getElementById("video_src").setAttribute("src", videoSrc);
  videoElement.load();

  console.log("updated videoSrc:", videoSrc);
}

// customize the directions
function windDir(currentDirection) {
  if (
    currentDirection == "N" ||
    currentDirection == "NbE" ||
    currentDirection == "NNE" ||
    currentDirection == "NEbN"
  ) {
    return "North";
  }
  if (
    currentDirection == "NE" ||
    currentDirection == "NEbE" ||
    currentDirection == "ENE" ||
    currentDirection === "EbN"
  ) {
    return "North East";
  }
  if (
    currentDirection == "E" ||
    currentDirection == "EbS" ||
    currentDirection == "ESE" ||
    currentDirection === "SEbE"
  ) {
    return "East";
  }
  if (
    currentDirection == "SE" ||
    currentDirection == "SEbS" ||
    currentDirection == "SSE" ||
    currentDirection === "SbE"
  ) {
    return "South East";
  }
  if (
    currentDirection == "S" ||
    currentDirection == "SbW" ||
    currentDirection == "SSW" ||
    currentDirection === "SWbS"
  ) {
    return "South";
  }
  if (
    currentDirection == "SW" ||
    currentDirection == "SWbW" ||
    currentDirection == "WSW" ||
    currentDirection === "WbS"
  ) {
    return "South West";
  }
  if (
    currentDirection == "W" ||
    currentDirection == "WbN" ||
    currentDirection == "WNW" ||
    currentDirection === "NWbW"
  ) {
    return "West";
  }
  if (
    currentDirection == "NW" ||
    currentDirection == "NWbN" ||
    currentDirection == "NNW" ||
    currentDirection === "NbW"
  ) {
    return "North West";
  }
}

// state color
function getColor(color) {
  const conditionColors = {
    1000: "gold", // Clear
    1003: "darkcyan", // Partly Cloudy
    1006: "darkgray", // Cloudy
    1009: "floralwhite", //
  };

  const colorcode = conditionColors[color] || "Coral";
  return colorcode;
}
