document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('city');
    const infoBox = document.getElementById('infoBox');

    searchBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission which refreshes the page
        const city = cityInput.value.trim();
        if(city) {
            getWeather(city);
        }
    });

    function getWeather(city) {
        const apiKey = '4f90d0c7f4387060b64058b54efe76db';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateInfoBox(data);
            // Once we have the current weather, we can also get the forecast using the coordinates
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            getForecast(lat, lon); // Call the getForecast function with the obtained latitude and longitude
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            infoBox.textContent = 'Failed to load weather data';
        });
    }

    function updateInfoBox(data) {
        infoBox.innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp} °F</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }

    function getForecast(lat, lon) {
        const apiKey = '4f90d0c7f4387060b64058b54efe76db'; // Your API key
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
    }
    
    function updateForecast(data) {
        // Loop through the forecast for the next five days
        for (let i = 0; i < 5; i++) {
            const forecastData = data.list[i * 8]; // Get the data point for approximately every 24 hours
            const dateTime = new Date(forecastData.dt * 1000);
            const date = dateTime.toLocaleDateString();
            const temp = forecastData.main.temp;
            const weather = forecastData.weather[0].description;
            const iconCode = forecastData.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            // Update the corresponding forecast box
            const forecastDiv = document.getElementById(`forecast-day-${i+1}`);
            forecastDiv.innerHTML = `
                <h4>${date}</h4>
                <img src="${iconUrl}" alt="Weather icon">
                <p>Temp: ${temp} °C</p>
                <p>${weather}</p>
            `;
        }
    }
});