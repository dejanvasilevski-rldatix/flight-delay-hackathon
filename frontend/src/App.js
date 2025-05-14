import React, { useEffect, useState } from "react";
import "./App.css";
import rldatixLogo from "./rldatix-logo.png";

const daysOfWeek = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

function App() {
  const [airports, setAirports] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedAirport, setSelectedAirport] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/airports")
      .then((res) => res.json())
      .then((data) => setAirports(data.airports));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day_of_week: selectedDay,
        origin_airport_id: Number(selectedAirport),
      }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="rldatix-bg">
      <div className="rldatix-logo-bar">
        <img src={rldatixLogo} alt="RLDatix Logo" className="rldatix-logo" />
      </div>
      <section className="rldatix-hero">
        <h1 className="rldatix-hero-title">Flight Delay Predictor</h1>
        <p className="rldatix-hero-subtitle">
          Instantly predict the chance of a flight delay for any US airport and day of the week.<br />
          Powered by RLDatix data science.
        </p>
      </section>
      <section className="rldatix-section">
        <div className="rldatix-card">
          <form className="rldatix-form" onSubmit={handleSubmit}>
            <div className="rldatix-form-group">
              <label htmlFor="day-select">Day of Week</label>
              <select
                id="day-select"
                value={selectedDay}
                onChange={e => setSelectedDay(Number(e.target.value))}
                className="rldatix-select"
              >
                {daysOfWeek.map(day => (
                  <option key={day.id} value={day.id}>{day.name}</option>
                ))}
              </select>
            </div>
            <div className="rldatix-form-group">
              <label htmlFor="airport-select">Airport</label>
              <select
                id="airport-select"
                value={selectedAirport}
                onChange={e => setSelectedAirport(e.target.value)}
                className="rldatix-select"
                required
              >
                <option value="">Select an airport</option>
                {airports.map(airport => (
                  <option key={airport.OriginAirportID} value={airport.OriginAirportID}>
                    {airport.OriginAirportName}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="rldatix-btn">Predict Delay</button>
          </form>
          {result && (
            <div className="rldatix-result">
              <h2>Prediction Result</h2>
              <div
                className={
                  "rldatix-badge " +
                  (result.chance_percent > 50
                    ? "delayed"
                    : result.chance_percent > 10
                    ? "caution"
                    : "ontime")
                }
              >
                {result.chance_percent > 50
                  ? "Delayed"
                  : result.chance_percent > 10
                  ? "Caution"
                  : "On Time"}
              </div>
              <p>
                <strong>Chance:</strong> {result.chance_percent}%<br />
                <strong>Confidence:</strong> {result.confidence_percent}%
              </p>
            </div>
          )}
        </div>
      </section>
      <footer className="rldatix-footer">
        &copy; {new Date().getFullYear()} RLDatix. All rights reserved.
      </footer>
    </div>
  );
}

export default App;