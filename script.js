const apiKey = '83934e7e42f34b86687d2ad210215b47';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
const forecastContainer = document.createElement('div');
forecastContainer.id = 'forecast-container';
weatherInfoContainer.insertAdjacentElement('afterend', forecastContainer);

// โหลดชื่อเมืองล่าสุดจาก localStorage
window.onload = () => {
    changeBackgroundByTime();
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        getWeather(lastCity);
    }
};

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName) {
        getWeather(cityName);
        localStorage.setItem("lastCity", cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});

async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p class="loading">⏳ กำลังโหลดข้อมูล...</p>`;
    forecastContainer.innerHTML = "";

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }
        const data = await response.json();
        displayWeather(data);
        getForecast(city); // ดึงพยากรณ์ 5 วัน
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, sys, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon, main: weatherMain } = weather[0];

    // เปลี่ยน background ตามสภาพอากาศ
    document.body.className = "";
    if (weatherMain.toLowerCase().includes("cloud")) {
        document.body.classList.add("cloudy");
    } else if (weatherMain.toLowerCase().includes("rain")) {
        document.body.classList.add("rainy");
    } else if (weatherMain.toLowerCase().includes("snow")) {
        document.body.classList.add("snowy");
    } else if (weatherMain.toLowerCase().includes("clear")) {
        document.body.classList.add("sunny");
    } else {
        document.body.classList.add("night");
    }

    const weatherHtml = `
        <div class="weather-info">
            <h2>${name}, ${sys.country}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p class="weather-temp">${temp.toFixed(1)}°C</p>
            <p class="weather-description">${description}</p>
            <p>ความชื้น: ${humidity}%</p>
        </div>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}


async function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            forecastContainer.innerHTML = "";
            const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            forecastList.forEach(item => {
                const date = item.dt_txt.split(" ")[0];
                const { temp } = item.main;
                const { description, icon } = item.weather[0];
                forecastContainer.innerHTML += `
                    <div class="forecast-day">
                        <div class="forecast-date">${date}</div>
                        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                        <div>${description}</div>
                        <div>${temp.toFixed(1)}°C</div>
                    </div>
                `;
            });
        });
}
// เปลี่ยนพื้นหลังตามเวลา
function changeBackgroundByTime() {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
        document.body.classList.add("night");
    } else {
        document.body.classList.remove("night");
    }
}

forecastList.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    const { temp } = item.main;
    const { description, icon } = item.weather[0];
    forecastContainer.innerHTML += `
        <div class="forecast-day">
            <div class="forecast-date">${date}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <div>${description}</div>
            <div class="forecast-temp">${temp.toFixed(1)}°C</div>
        </div>
    `;
});