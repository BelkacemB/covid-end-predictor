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
  const [daysPeriod, setDaysPeriod] = useState(3);
  const [threshold, setThreshold] = useState(0.7);
  const [endDate, setEndDate] = useState(new Date());
  const [vaccinationRegion, setVaccinationRegion] = useState("World");
  const [targetRegion, setTargetRegion] = useState("World");
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

  const handleVaccinationRegionChange = (event: any, value: any) => {
    setVaccinationRegion(value);
    setTargetRegion(value);
  };

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
        <MenuItem value={0.6}>60%</MenuItem>
        <MenuItem value={0.7}>70%</MenuItem>
        <MenuItem value={0.8}>80%</MenuItem>
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
          vaccType={vaccType}
        />
      ) : (
        <br />
      )}
    </div>
  );
}

export default Predictor;
