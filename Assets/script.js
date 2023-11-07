document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('city');
    const infoBox = document.getElementById('infoBox');
    const forecast = document.getElementById('forecast');

    searchBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission which refreshes the page
        const city = cityInput.value.trim();
        if(city) {
            getWeather(city);
        }
    });

    function getWeather(city) {
        const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
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
            // For the forecast, you would typically call another API endpoint
            // getForecast(city);
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            infoBox.textContent = 'Failed to load weather data';
        });
    }

    function updateInfoBox(data) {
        infoBox.innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }