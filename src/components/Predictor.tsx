import React, { useState, useEffect } from "react";
import CountryCard from "./CountryCard";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  getEndDate,
  getNumberOfVaccinationsPerDayPerRegion,
  getAvailableCountries,
} from "../model/Model";

function Predictor(props: any) {
  var { data } = props;
  const [daysPeriod, setDaysPeriod] = useState(1);
  const [threshold, setThreshold] = useState(0.7);
  const [endDate, setEndDate] = useState(new Date());
  const [vaccinationRegion, setVaccinationRegion] = useState("United States");
  const [targetRegion, setTargetRegion] = useState("United States");
  const [countryMenuItems, setCountryMenuItems] = useState<Array<JSX.Element>>(
    []
  );

  useEffect(() => {
    let dailyVaccPerRegion = getNumberOfVaccinationsPerDayPerRegion(
      daysPeriod,
      vaccinationRegion,
      data
    );
    setEndDate(getEndDate(dailyVaccPerRegion, threshold, targetRegion, data));
  }, [data, threshold, daysPeriod, vaccinationRegion, targetRegion]);

  const handleDaysChange = (event: any) => {
    setDaysPeriod(event.target.value);
  };

  const handleThresholdChange = (event: any) => {
    setThreshold(event.target.value);
  };

  const handleVaccinationRegionChange = (event: any) => {
    setVaccinationRegion(event.target.value);
    setTargetRegion(event.target.value);
  };

  const handleTargetRegionChange = (event: any) => {
    setTargetRegion(event.target.value);
    setVaccinationRegion(event.target.value);
  };

  useEffect(() => {
    let countryMenuItems: JSX.Element[] = getAvailableCountries(data).map(
      (country) => {
        return (
          <MenuItem value={country} id={country}>
            {country}
          </MenuItem>
        );
      }
    );
    setCountryMenuItems(countryMenuItems);
  }, [data]);

  return (
    <div id="predictor">
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
      days in the &nbsp;
      <Select
        labelId="vaccinationCountryLabel"
        id="vaccinationCountryId"
        value={vaccinationRegion}
        onChange={handleVaccinationRegionChange}
      >
        {countryMenuItems}
      </Select>
      , &nbsp; <br />
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
      &nbsp; of the &nbsp;
      <Select
        labelId="targetCountryLabel"
        id="targetCountryId"
        value={targetRegion}
        onChange={handleTargetRegionChange}
      >
        {countryMenuItems}
      </Select>
      population will be vaccinated in:
      <h1 className="date">{endDate.toLocaleDateString("fr-FR")}</h1>
      {data != null ? (
        <CountryCard
          daysPeriod={daysPeriod}
          region={targetRegion}
          data={data}
          threshold={threshold}
        />
      ) : (
        <br />
      )}
    </div>
  );
}

export default Predictor;
