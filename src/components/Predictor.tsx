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
  const [daysPeriod, setDaysPeriod] = useState(3);
  const [threshold, setThreshold] = useState(0.7);
  const [endDate, setEndDate] = useState(new Date());
  const [vaccinationRegion, setVaccinationRegion] = useState("World");
  const [targetRegion, setTargetRegion] = useState("World");
  const [countryMenuItems, setCountryMenuItems] = useState<Array<JSX.Element>>(
    []
  );
  const [vaccType, setVaccType] = useState("primo");

  useEffect(() => {
    dataRef.current = data.map((x: any) => {
      return {
        ...x,
        total_vaccinations:
          vaccType === "full"
            ? x.people_fully_vaccinated == null
              ? NaN
              : x.people_fully_vaccinated
            : x.total_vaccinations - x.people_fully_vaccinated,
      };
    });
  }, [vaccType, data]);

  useEffect(() => {
    let dailyVaccPerRegion = getNumberOfVaccinationsPerDayPerRegion(
      daysPeriod,
      vaccinationRegion,
      dataRef.current
    );
    setEndDate(
      getEndDate(dailyVaccPerRegion, threshold, targetRegion, dataRef.current)
    );
  }, [threshold, daysPeriod, vaccinationRegion, targetRegion, vaccType]);

  const handleDaysChange = (event: any) => {
    setDaysPeriod(event.target.value);
  };

  const handleVaccTypeChange = (event: any) => {
    setVaccType(event.target.value);
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
    let countryMenuItems: JSX.Element[] = getAvailableCountries(
      dataRef.current
    ).map((country) => {
      return (
        <MenuItem value={country} id={country}>
          {country}
        </MenuItem>
      );
    });
    setCountryMenuItems(countryMenuItems);
  }, []);

  return (
    <div id="predictor">
      Based on the rate of &nbsp;
      <Select
        labelId="vaccTypeLabel"
        id="vaccTypeLabelId"
        value={vaccType}
        onChange={handleVaccTypeChange}
      >
        <MenuItem value={"primo"}>first injections</MenuItem>
        <MenuItem value={"full"}>full vaccinations</MenuItem>
      </Select>
      in the last &nbsp;
      <Select
        labelId="daysPeriodLabel"
        id="daysPeriodId"
        value={daysPeriod}
        onChange={handleDaysChange}
      >
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
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
