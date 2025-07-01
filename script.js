//making object of weatherapi
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

//adding event listener key press of enter
let searchInputBox = document.getElementById('input-box');

searchInputBox.addEventListener('input', () => {
    let formatted = formatInput(searchInputBox.value);
    searchInputBox.value = formatted;
});

searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
    }
});

// function to capitalize each word
function formatInput(str) {
    if (!str) return "";
    return str.trim()
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
}

//get weather report
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => weather.json())
        .then(showWeaterReport);
}

//show weather report
function showWeaterReport(weather) {
    let city_code = weather.cod;
    if (city_code === '400' || city_code === 400) {
        swal("Empty Input", "Please enter any city", "error");
        reset();
    } else if (city_code === '404' || city_code === 404) {
        swal("Bad Input", "Entered city didn't match", "warning");
        reset();
    } else {
        let op = document.getElementById('weather-body');
        op.style.display = 'block';
        let todayDate = new Date();
        let parent = document.getElementById('parent');
        let weather_body = document.getElementById('weather-body');
        weather_body.innerHTML = `
            <div class="location-deatils">
                <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
                <div class="date" id="date"> ${dateManage(todayDate)}</div>
            </div>
            <div class="weather-status">
                <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C </div>
                <div class="weather" id="weather"> ${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i>  </div>
                <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max) </div>
                <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
            </div>
            <hr>
            <div class="day-details">
                <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}% <br> Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
            </div>
        `;
        parent.append(weather_body);
        changeBg(weather.weather[0].main);
        reset();
    }
}

// time and date helpers
function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    return `${date} ${month} (${day}), ${year}`;
}

// change background using css variable
function changeBg(status) {
    let imgUrl = "img/bg.jpg";
    if (status === 'Clouds') imgUrl = 'img/clouds.jpg';
    else if (status === 'Rain') imgUrl = 'img/rainy.jpg';
    else if (status === 'Clear') imgUrl = 'img/clear.jpg';
    else if (status === 'Snow') imgUrl = 'img/snow.jpg';
    else if (status === 'Sunny') imgUrl = 'img/sunny.jpg';
    else if (status === 'Thunderstorm') imgUrl = 'img/thunderstrom.jpg';
    else if (status === 'Drizzle') imgUrl = 'img/drizzle.jpg';
    else if (status === 'Mist' || status === 'Haze' || status === 'Fog') imgUrl = 'img/mist.jpg';

    document.documentElement.style.setProperty('--bg-image', `url(${imgUrl})`);
}

// icons
function getIconClass(classarg) {
    if (classarg === 'Rain') return 'fas fa-cloud-showers-heavy';
    else if (classarg === 'Clouds') return 'fas fa-cloud';
    else if (classarg === 'Clear') return 'fas fa-cloud-sun';
    else if (classarg === 'Snow') return 'fas fa-snowman';
    else if (classarg === 'Sunny') return 'fas fa-sun';
    else if (classarg === 'Mist') return 'fas fa-smog';
    else if (classarg === 'Thunderstorm' || classarg === 'Drizzle') return 'fas fa-thunderstorm';
    else return 'fas fa-cloud-sun';
}

function reset() {
    document.getElementById('input-box').value = "";
}

function addZero(i) {
    return i < 10 ? "0" + i : i;
}
