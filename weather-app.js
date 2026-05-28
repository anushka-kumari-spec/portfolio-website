const weatherForm = document.querySelector(".weather-form");
const cityInput = document.querySelector("#city");
const weatherCard = document.querySelector(".weather-card");
const locationName = document.querySelector(".location-name");
const weatherTime = document.querySelector(".weather-time");
const weatherTemp = document.querySelector(".weather-temp");
const weatherDesc = document.querySelector(".weather-description");
const weatherWind = document.querySelector(".weather-wind");
const weatherHumidity = document.querySelector(".weather-humidity");
const weatherCondition = document.querySelector(".weather-condition");
const weatherError = document.querySelector(".weather-error");

const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Heavy rain showers",
    82: "Violent rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail"
};

function formatTime(timestamp, zone) {
    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: zone
    }).format(new Date(timestamp));
}

function showError(message) {
    weatherError.textContent = message;
    weatherCard.classList.add("hidden");
}

function showWeather(city, country, time, temperature, condition, wind, humidity, timezone) {
    locationName.textContent = `${city}, ${country}`;
    weatherTime.textContent = formatTime(time, timezone);
    weatherTemp.textContent = `${Math.round(temperature)}°C`;
    weatherDesc.textContent = condition;
    weatherWind.textContent = `${wind} km/h`;
    weatherHumidity.textContent = `${humidity}%`;
    weatherCondition.textContent = condition;
    weatherError.textContent = "";
    weatherCard.classList.remove("hidden");
}

async function loadWeather(cityName) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
        throw new Error("Unable to find the location.");
    }

    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Try another name.");
    }

    const location = geoData.results[0];
    const latitude = location.latitude;
    const longitude = location.longitude;
    const timezone = location.timezone || "auto";

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=${encodeURIComponent(timezone)}`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
        throw new Error("Unable to load weather data.");
    }

    const weatherData = await weatherResponse.json();
    if (!weatherData.current_weather) {
        throw new Error("Weather service returned no current data.");
    }

    const current = weatherData.current_weather;
    const humidityIndex = weatherData.hourly.time.indexOf(current.time);
    const humidity = humidityIndex !== -1 ? weatherData.hourly.relativehumidity_2m[humidityIndex] : null;
    const conditionText = weatherCodes[current.weathercode] || "Unknown conditions";

    showWeather(location.name, location.country, current.time, current.temperature, conditionText, current.windspeed, humidity ?? "—", timezone);
}

if (weatherForm) {
    weatherForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const city = cityInput.value.trim();

        if (!city) {
            showError("Please enter a city name.");
            return;
        }

        weatherError.textContent = "Searching...";
        weatherCard.classList.add("hidden");

        try {
            await loadWeather(city);
        } catch (error) {
            showError(error.message);
        }
    });
}
