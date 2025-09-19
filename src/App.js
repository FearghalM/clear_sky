import React, { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import "./App.css";

export default function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check if geolocation is available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        });
      } else {
        // Fallback to a default location (Dublin, Ireland) for testing
        setLat(53.3498);
        setLong(-6.2603);
      }
    };
    fetchData();
  }, []);

  // Separate effect for API calls when coordinates are available
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (lat && long) {
        try {
          // Fetch current weather
          const currentResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
          );
          if (currentResponse.ok) {
            const currentResult = await currentResponse.json();
            setData(currentResult);
          }

          // Fetch 5-day forecast
          const forecastResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/forecast/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
          );
          if (forecastResponse.ok) {
            const forecastResult = await forecastResponse.json();
            setForecastData(forecastResult);
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };
    fetchWeatherData();
  }, [lat, long]);

  return (
    <div className="App">
      {data ? (
        <>
          <WeatherCard weatherData={data} />
          {forecastData && <ForecastCard forecastData={forecastData} />}
        </>
      ) : (
        <p className="loading">Loading weather...</p>
      )}
    </div>
  );
}
