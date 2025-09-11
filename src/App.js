import './App.css';
import React, { useEffect, useState } from "react";

export default function App() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }, []);

  return (
    <div className="App">
      <h1>Clear Sky</h1>
      <h2>Latitude: {lat}</h2>
      <h2>Longitude: {lon}</h2>
    </div>
  );
}