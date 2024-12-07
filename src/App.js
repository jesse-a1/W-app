import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [displayName, setDisplayName] = useState(''); // State to store the English local name.

  const API_KEY = '3415abd977a2c51135cd78c628bf0331'; // Replace with your own API key.

  // Fetch coordinates for the location entered
  const fetchCoordinates = async (event) => {
    if (event.key === 'Enter') {
      try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
        const geoResponse = await axios.get(geoUrl);

        if (geoResponse.data.length > 0) {
          const { lat, lon, local_names } = geoResponse.data[0];
          setCoordinates({ lat, lon });
          setDisplayName(local_names?.en || 'Unknown Location'); // Save English local name or fallback.
          fetchWeather(lat, lon);
        } else {
          alert('Location not found');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      } finally {
        setLocation('');
      }
    }
  };

  // Fetch weather data using One Call 3.0 API
  const fetchWeather = async (lat, lon) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
      const weatherResponse = await axios.get(weatherUrl);
      setData(weatherResponse.data);
      console.log(weatherResponse.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={fetchCoordinates}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        {data.current && (
          <>
            <div className="top">
              <div className="location">
                <p>{displayName}</p> {/* Display the English local name */}
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
          </>
        )}
      </div>
    </div>
  );
}

export default App;
