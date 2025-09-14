import React, { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

export default function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      if (lat && long) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
        );
        const result = await response.json();
        setData(result);
      }
    };
    fetchData();
  }, [lat, long]);

  return (
    <div className="App">
      {data ? (
        <WeatherCard weatherData={data} />
      ) : (
        <p className="loading">Loading weather...</p>
      )}
    </div>
  );
}
