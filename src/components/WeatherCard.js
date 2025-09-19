import React from "react";
import moment from "moment";
import "./WeatherCard.css";

const WeatherCard = ({ weatherData, units, showDetails, onOptionChange, onRefresh }) => {
  const tempUnit = units === 'imperial' ? '°F' : '°C';

  return (
    <div className="card">
      <div className="card-top">
        <h2 className="city">{weatherData.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="options-dropdown"
            value={units === 'imperial' ? 'fahrenheit' : 'celsius'}
            onChange={onOptionChange}
          >
            <option value="celsius">Show °C</option>
            <option value="fahrenheit">Show °F</option>
            <option value="details">{showDetails ? 'Hide Details' : 'More Details'}</option>
          </select>
          <button className="refresh" onClick={onRefresh}>⟳</button>
        </div>
      </div>

      <div className="row">
        <p className="day">
          {moment().format("dddd")}, {moment().format("LL")}
        </p>
        <p className="description">
          {weatherData.weather[0].main}
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
        </p>
      </div>

      <div className="row">
        <p className="temp">Temperature: {weatherData.main.temp}{tempUnit}</p>
        <p className="temp">Humidity: {weatherData.main.humidity}%</p>
      </div>

      <div className="row">
        <p className="sun">
          Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
        </p>
        <p className="sun">
          Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
        </p>
      </div>

      {showDetails && (
        <div className="row" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
          <p className="temp">Feels like: {weatherData.main.feels_like}{tempUnit}</p>
          <p className="temp">Pressure: {weatherData.main.pressure} hPa</p>
          <p className="temp">Wind: {weatherData.wind.speed} {units === 'imperial' ? 'mph' : 'm/s'}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;