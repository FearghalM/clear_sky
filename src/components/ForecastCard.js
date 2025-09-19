import React from "react";
import moment from "moment";
import "./ForecastCard.css";

const ForecastCard = ({ forecastData }) => {
  // Group forecast data by day (OpenWeatherMap returns 3-hour intervals)
  const dailyForecasts = forecastData.list.reduce((acc, forecast) => {
    const date = moment(forecast.dt * 1000).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = {
        date: date,
        temp_min: forecast.main.temp,
        temp_max: forecast.main.temp,
        weather: forecast.weather[0],
        forecasts: []
      };
    }
    acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp);
    acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp);
    acc[date].forecasts.push(forecast);
    return acc;
  }, {});

  // Get first 5 days
  const fiveDayForecast = Object.values(dailyForecasts).slice(0, 5);

  return (
    <div className="forecast-card">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-list">
        {fiveDayForecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-day">
              {index === 0 ? 'Today' : moment(day.date).format('ddd')}
            </div>
            <div className="forecast-weather">
              <img
                src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                alt={day.weather.description}
                className="forecast-icon"
              />
              <span className="forecast-description">{day.weather.main}</span>
            </div>
            <div className="forecast-temps">
              <span className="temp-max">{Math.round(day.temp_max)}°</span>
              <span className="temp-min">{Math.round(day.temp_min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;