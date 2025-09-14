import React from "react";
import moment from "moment";
import "./WeatherCard.css";

const WeatherCard = ({ weatherData }) => {
  const refresh = () => window.location.reload();

  return (
    <div className="card">
      <div className="card-top">
        <h2 className="city">{weatherData.name}</h2>
        <button className="refresh" onClick={refresh}>⟳</button>
      </div>

      <div className="row">
        <p className="day">
          {moment().format("dddd")}, {moment().format("LL")}
        </p>
        <p className="description">
          {weatherData.weather[0].main}
          {/* Weather Icon */}
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            style={{ verticalAlign: "middle", marginLeft: "8px" }}
          />
        </p>
      </div>

      <div className="row">
        <p className="temp">Temperature: {weatherData.main.temp}°C</p>
        <p className="temp">Humidity: {weatherData.main.humidity}%</p>
      </div>

      <div className="row">
        <p className="sun">
          Sunrise:{" "}
          {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
        </p>
        <p className="sun">
          Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;