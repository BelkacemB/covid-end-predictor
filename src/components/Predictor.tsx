import { useState, useEffect, useRef } from "react";
import CountryCard from "./CountryCard";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getEndDate,
  getNumberOfVaccinationsPerDayPerRegion,
  getAvailableCountries,
} from "../model/Model";

function Predictor(props: any) {
  let { data } = props;
  const dataRef = useRef(data);
  const [daysPeriod, setDaysPeriod] = useState(20);
  const [threshold, setThreshold] = useState(0.9);
  const [endDate, setEndDate] = useState(new Date());
  const [vaccinationRegion, setVaccinationRegion] = useState("World");
  const [targetRegion, setTargetRegion] = useState("World");

  useEffect(() => {
    dataRef.current = data.map((x: any) => {
      return {
        ...x,
        total_vaccinations:
           x.people_fully_vaccinated == null
              ? NaN
              : x.people_fully_vaccinated
      };
    });
  }, [data]);

  useEffect(() => {
    let dailyVaccPerRegion = getNumberOfVaccinationsPerDayPerRegion(
      daysPeriod,
      vaccinationRegion,
      dataRef.current
    );
    setEndDate(
      getEndDate(dailyVaccPerRegion, threshold, targetRegion, dataRef.current)
    );
  }, [threshold, daysPeriod, vaccinationRegion, targetRegion]);

  const handleDaysChange = (event: any) => {
    setDaysPeriod(event.target.value);
  };

  const handleThresholdChange = (event: any) => {
    setThreshold(event.target.value);
  };

  const handleVaccinationRegionChange = (event: any, value: any) => {
    if (value) {
      setVaccinationRegion(value);
      setTargetRegion(value);
    }
  };

  return (
    <div id="predictor">
      Based on the rate of vaccinations
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
      <Autocomplete
        id="vaccinationCountryId"
        autoComplete={true}
        value={vaccinationRegion}
        options={getAvailableCountries(dataRef.current)}
        onChange={handleVaccinationRegionChange}
        style={{ width: 250, display: "inline-block" }}
        renderInput={(params) => (
          <TextField {...params} label="Region" variant="outlined" />
        )}
      />
      , &nbsp;
      <Select
        labelId="thresholdLabel"
        id="thresholdId"
        value={threshold}
        onChange={handleThresholdChange}
      >
        <MenuItem value={0.85}>85%</MenuItem>
        <MenuItem value={0.9}>90%</MenuItem>
        <MenuItem value={0.95}>95%</MenuItem>
      </Select>
      &nbsp; of the &nbsp; {targetRegion} &nbsp; population will be vaccinated
      in: <br />
      <br />
      <h1 className="date">{endDate.toLocaleDateString("fr-FR")}</h1>
      {dataRef.current != null ? (
        <CountryCard
          daysPeriod={daysPeriod}
          region={targetRegion}
          data={dataRef.current}
          endDate={endDate}
          threshold={threshold}
          vaccType={"full"}
        />
      ) : (
        <br />
      )}
    </div>
  );
}

export default Predictor;
