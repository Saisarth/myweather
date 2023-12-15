// WeatherApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState(null);

  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=4aa58c9d66577719b1e84cc6cbc6dd54`
      );
      setCities(response.data);
    } catch (error) {
      setError('Error fetching cities');
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoadingWeather(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4aa58c9d66577719b1e84cc6cbc6dd54`
      );
      setWeatherData(response.data);
    } catch (error) {
      setError('Error fetching weather data');
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchCities();
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedCity) {
      fetchWeatherData(selectedCity.lat, selectedCity.lon);
    }
  }, [selectedCity]);

  // Inside the WeatherApp component
return (
  <div style={styles.weatherApp}>
    <input
      type="text"
      placeholder="Enter city name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={styles.input}
    />
    {loadingCities && <p>Loading cities...</p>}
    {error && <p style={styles.error}>Error: {error}</p>}
    {!error && cities.length > 0 && (
      <ul style={styles.cityList}>
        {cities.map((city) => (
          <li
            key={city.name}
            onClick={() => setSelectedCity(city)}
            style={styles.cityListItem}
          >
            {city.name}, {city.state}, {city.country}
          </li>
        ))}
      </ul>
    )}
    {loadingWeather && <p>Loading weather data...</p>}
    {!loadingWeather && weatherData && !error && (
      <div style={styles.weatherInfo}>
        <h2>{weatherData.name}</h2>
        <p>{weatherData.weather[0].description}</p>
        <p>Temperature: {weatherData.main.temp}°C</p>
      </div>
    )}
  </div>
);

};

const styles = {
  weatherApp: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
  },
  loading: {
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
  cityList: {
    listStyle: 'none',
    padding: '0',
    margin: '10px 0',
  },
  cityListItem: {
    cursor: 'pointer',
    padding: '5px',
    margin: '5px 0',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
  },
  weatherInfo: {
    marginTop: '20px',
  },
};

export default App;
