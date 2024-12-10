import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dailyForecast, setDailyForecast] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [fadeEffect, setFadeEffect] = useState(''); 

  const API_KEY = '3415abd977a2c51135cd78c628bf0331';

  // Fetch Weather Data & Set Background
  const fetchWeather = async (lat, lon) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
      const weatherResponse = await axios.get(weatherUrl);

      setData(weatherResponse.data);
      setDailyForecast(weatherResponse.data.daily.slice(1, 7));

      const currentCondition = weatherResponse.data.current.weather[0].main.toLowerCase();
      setWeatherBackground(currentCondition);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Set Background Image with Fade Effect
  const setWeatherBackground = (condition) => {
    const weatherBackgrounds = {
      clear: "url('https://cardinalwxservice.com/wp-content/uploads/2020/10/1031_nc_sunny_weather_3-1.jpg')",
      clouds: "url('https://www.wkbn.com/wp-content/uploads/sites/48/2021/03/clouds-cloudy-sky-spring-summer-fall-winter-weather-generic-8-1.jpg?w=1280')",
      rain: "url('https://t3.ftcdn.net/jpg/07/51/95/52/360_F_751955222_znAJXCxEyHNzMUqVM74ZknWKGfNP5K69.jpg')",
      snow: "url('https://t4.ftcdn.net/jpg/01/30/24/67/360_F_130246761_XVWbg4AGgGu7SlcKi2QPR23J03U710mP.jpg')",
      thunderstorm: "url('https://media.13newsnow.com/assets/WVEC/images/e23dc125-7f4c-4783-8b28-925ec0d61d6f/e23dc125-7f4c-4783-8b28-925ec0d61d6f_750x422.jpg')",
      mist: "url('https://i0.wp.com/www.gary-randall.com/wp-content/uploads/2020/11/DSC_6994-3w.jpg?fit=2048%2C1362&ssl=1')"
    };

    setFadeEffect('fade-background');  // Trigger fade animation
    setBackgroundImage(
      weatherBackgrounds[condition] || 
      "url('https://source.unsplash.com/1600x900/?weather')"
    );

    // Remove Fade Effect After Animation Completes
    setTimeout(() => setFadeEffect(''), 1500); 
  };

  // Fetch Suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
      const geoResponse = await axios.get(geoUrl);

      const uniqueSuggestions = geoResponse.data.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (loc) =>
              loc.name.toLowerCase() === value.name.toLowerCase() &&
              loc.country.toLowerCase() === value.country.toLowerCase()
          )
      );
      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle Typing in Search Bar
  const handleLocationChange = (event) => {
    const query = event.target.value;
    setLocation(query);

    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  };

  // Handle Suggestion Click
  const handleSuggestionClick = (suggestion) => {
    const { lat, lon, name, country } = suggestion;
    setDisplayName(`${name}, ${country}`);
    fetchWeather(lat, lon);
    setSuggestions([]);
    setLocation('');
  };

  // Convert UNIX Timestamp to Day Name
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div
      className={`App ${fadeEffect}`}
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="content-wrapper">
        <div className="App-header">SkyTracker</div>

        {/* Search Bar */}
        <div className="search">
          <input
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter Location"
            type="text"
          />

          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}, {suggestion.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current Weather Display */}
        {data.current && (
          <div className="container">
            <div className="top">
              <div className="location">
                <p>{displayName}</p>
              </div>
              <div className="temp">
                <h1>{data.current.temp.toFixed()}°F</h1>
              </div>
              <div className="description">
                <p>{data.current.weather[0].main}</p>
              </div>
            </div>

            <div className="bottom">
              <div className="humidity">
                <p>Humidity</p>
                <p className="bold">{data.current.humidity}%</p>
              </div>
              <div className="wind">
                <p>Wind Speed</p>
                <p className="bold">{data.current.wind_speed.toFixed()} MPH</p>
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Weather Forecast */}
        {dailyForecast.length > 0 && (
          <div className="forecast-container">
            <h2>7-Day Forecast</h2>
            <div className="forecast-grid">
              {dailyForecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <p className="day">{getDayName(day.dt)}</p>

                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />

                  <p className="condition">{day.weather[0].main}</p>
                  <p className="temp-range">
                    {Math.round(day.temp.max)}°F / {Math.round(day.temp.min)}°F
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
