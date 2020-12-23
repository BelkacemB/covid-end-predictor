import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { getEndDate, getNumberOfVaccinationsPerDay } from "./model/Model";
import "./App.css";

function App() {
  const [daysPeriod, setDaysPeriod] = useState(10);
  const [threshold, setThreshold] = useState(0.7);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    let vaccinationRate: number = getNumberOfVaccinationsPerDay(daysPeriod);
    setEndDate(getEndDate(vaccinationRate, threshold));
  }, [daysPeriod, threshold]);

  const handleDaysChange = (event: any) => {
    setDaysPeriod(event.target.value);
  };

  const handleThresholdChange = (event: any) => {
    setThreshold(event.target.value);
  };

  return (
    <div className="App">
      <h2>End of Covid-19 predictor</h2>
      <p>
        Based on the speed of vaccination in the last &nbsp;
        <Select
          labelId="daysPeriodLabel"
          id="daysPeriodId"
          value={daysPeriod}
          onChange={handleDaysChange}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
        days ,
        <Select
          labelId="thresholdLabel"
          id="thresholdId"
          value={threshold}
          onChange={handleThresholdChange}
        >
          <MenuItem value={0.6}>60%</MenuItem>
          <MenuItem value={0.7}>70%</MenuItem>
          <MenuItem value={0.8}>80%</MenuItem>
        </Select>
        &nbsp; of the world population will be vaccinated in:
      </p>
      <h1>{endDate.toLocaleDateString("fr-FR")}</h1>
    </div>
  );
}

export default App;
