import './App.css';
import React, { useEffect, useState } from "react";
import Weather from './components/Weather';

export default function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);
  
  useEffect(() => {
     const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
      });

    await fetch(`${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        console.log(result);
      });
    }
      fetchData();
  }, [lat, long]);

  return (
    <div className="App">
      <h1>Clear Sky</h1>
      <h2>Latitude: {lat}</h2>
      <h2>Longitude: {long}</h2>
    </div>
  );
}