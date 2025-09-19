import React, { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

export default function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        setGeoError(null);
      },
      (error) => {
        setGeoError('Unable to retrieve your location.');
      }
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (lat && long) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
          );
          const result = await response.json();
          setData(result);
        } catch (e) {
          setGeoError('Failed to fetch weather data.');
        }
      }
    };
    fetchData();
  }, [lat, long]);

  return (
    <div className="App">
      {geoError ? (
        <p className="error">{geoError}</p>
      ) : data ? (
        <WeatherCard weatherData={data} />
      ) : (
        <p className="loading">Loading weather...</p>
      )}
    </div>
  );
}
