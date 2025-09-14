import React from 'react';
import './styles.css';

const WeatherCard = ({ weatherData }) => (
  <div className="weather-card">
    <div className="weather-card-header">{weatherData.name}</div>
    {/* Add more weather details here if needed */}
  </div>
);

export default WeatherCard;