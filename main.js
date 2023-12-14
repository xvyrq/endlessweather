async function getWeather() {
    if ('geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude.toFixed(4);
          const longitude = position.coords.longitude.toFixed(4);
  
          const apiUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
  
          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
  
            if (response.ok) {
              const forecastUrl = data.properties.forecast;
              const forecastResponse = await fetch(forecastUrl);
              const forecastData = await forecastResponse.json();
  
              if (forecastResponse.ok) {
                displayWeather(forecastData, data.properties.forecastHourly, data.properties.forecastGridData);
              } else {
                showError(forecastData.title);
              }
            } else {
              showError(data.title);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            showError('There was an issue fetching the weather data.');
          }
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        showError('There was an issue getting your location.');
      }
    } else {
      showError('Geolocation is not supported by your browser.');
    }
  }
  
  function displayWeather(forecastData, hourlyForecastUrl, gridForecastUrl) {
    const weatherInfo = document.getElementById('weather-info');
  
    if (forecastData && forecastData.properties && forecastData.properties.periods && forecastData.properties.periods.length > 0) {
      const forecast = forecastData.properties.periods[0]; // Get the first forecast period
  
      weatherInfo.innerHTML = `
        <h2>${forecast.name}</h2>
        <p>Weather: ${forecast.shortForecast}</p>
        <p>Temperature: ${forecast.temperature} ${forecast.temperatureUnit}</p>
      `;
    } else {
      showError('No weather data available.');
    }
  }
  
  function showError(message) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `<p>${message}</p>`;
  }
  