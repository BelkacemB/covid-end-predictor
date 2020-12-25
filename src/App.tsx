import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  getEndDate,
  getNumberOfVaccinationsPerDayPerRegion,
} from "./model/Model";
import "./App.css";

function App() {
  const [daysPeriod, setDaysPeriod] = useState(1);
  const [threshold, setThreshold] = useState(0.7);
  const [endDate, setEndDate] = useState(new Date());
  const [vaccinationData, setVaccinationData] = useState([]);

  useEffect(() => {
    fetch("https://covid-express.herokuapp.com/api/vaccinations")
      .then((res) => res.json())
      .then((data) => {
        setVaccinationData(data);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    let vaccinationRate: number = getNumberOfVaccinationsPerDayPerRegion(
      daysPeriod,
      "World",
      vaccinationData
    );
    setEndDate(getEndDate(vaccinationRate, threshold, vaccinationData));
  }, [vaccinationData, threshold, daysPeriod]);

  const handleDaysChange = (event: any) => {
    setDaysPeriod(event.target.value);
  };

  const handleThresholdChange = (event: any) => {
    setThreshold(event.target.value);
  };

  return (
    <div className="App">
      <h2>End of Covid-19 predictor</h2>
      
        Based on the speed of vaccination in the last &nbsp;
        <Select
          labelId="daysPeriodLabel"
          id="daysPeriodId"
          value={daysPeriod}
          onChange={handleDaysChange}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
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
      
      <h1>{endDate.toLocaleDateString("fr-FR")}</h1>
    </div>
  );
}

export default App;
