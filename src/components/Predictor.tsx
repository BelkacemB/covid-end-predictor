import React, { useState, useEffect, useRef } from "react";
import CountryCard from "./CountryCard";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  getEndDate,
  getNumberOfVaccinationsPerDayPerRegion,
  getAvailableCountries,
} from "../model/Model";

function Predictor(props: any) {
  let { data } = props; 
  const dataRef = useRef(data); 
  const [daysPeriod, setDaysPeriod] = useState(1);
  const [threshold, setThreshold] = useState(0.7);
  const [endDate, setEndDate] = useState(new Date());
  const [vaccinationRegion, setVaccinationRegion] = useState("United States");
  const [targetRegion, setTargetRegion] = useState("United States");
  const [countryMenuItems, setCountryMenuItems] = useState<Array<JSX.Element>>(
    []
  );
  const [vaccType, setVaccType] = useState("Primo");

  useEffect(() => {
     dataRef.current = (data.map((e: any) => {
          e.total_vaccinations =
            vaccType === "Full"
              ? e.people_fully_vaccinated
              : e.total_vaccinations - e.people_fully_vaccinated;
          return e;
        }));
  }, [vaccType, data]);

  useEffect(() => {
    let dailyVaccPerRegion = getNumberOfVaccinationsPerDayPerRegion(
      daysPeriod,
      vaccinationRegion,
      vaccType,
      dataRef.current
    );
    setEndDate(getEndDate(dailyVaccPerRegion, threshold, targetRegion, dataRef.current));
  }, [threshold, daysPeriod, vaccinationRegion, targetRegion, vaccType]);

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
    let countryMenuItems: JSX.Element[] = getAvailableCountries(dataRef.current).map(
      (country) => {
        return (
          <MenuItem value={country} id={country}>
            {country}
          </MenuItem>
        );
      }
    );
    setCountryMenuItems(countryMenuItems);
  }, []); 

  return (
    <div id="predictor">
      Based on the rate of vaccinations in the last &nbsp;
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
      , &nbsp;
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
      population will be vaccinated in: <br />
      <br />
      <h1 className="date">{endDate.toLocaleDateString("fr-FR")}</h1>
      {dataRef.current != null ? (
        <CountryCard
          daysPeriod={daysPeriod}
          region={targetRegion}
          data={dataRef.current}
          endDate={endDate}
          threshold={threshold}
          vaccType={vaccType}
        />
      ) : (
        <br />
      )}
    </div>
  );
}

export default Predictor;
