import React, { useEffect, useRef, useState } from "react";
import {
  getAvailableCountries,
  getNumberOfVaccinationsPerDayPerRegion,
  getEndDate,
  dateCompare,
} from "../model/Model";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

function Ranking(props: any) {
  let { data } = props;
  const [vaccType, setVaccType] = useState("full");
  const [contextualData, setContextualData] = useState(data);
  const handleVaccTypeChange = (e: any) => {
    setVaccType(e.target.value);
  };

  const dataRef = useRef(data);

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
    setContextualData(dataRef.current);
  }, [vaccType, data]);

  let todaysDate = new Date();
  let availableCountries = getAvailableCountries(contextualData);

  let countriesRanked = availableCountries
    ?.map((country) => {
      let dailyVaccPerRegion = getNumberOfVaccinationsPerDayPerRegion(
        3,
        country,
        contextualData
      );
      let endDate = getEndDate(
        dailyVaccPerRegion,
        0.6,
        country,
        contextualData
      );
      let countryAndEndDate = { country: country, date: endDate };
      return countryAndEndDate;
    })
    .filter((cd) => isFinite(cd.date.getTime()));

  countriesRanked.sort(dateCompare).reverse();

  let countryRows: JSX.Element[] = countriesRanked.map((countryAndDate) => {
    return (
      <tr key={countryAndDate.country}>
        <td>{countryAndDate.country}</td>
        <td>
          {countryAndDate.date <= todaysDate ? (
            <span role="img" aria-label="chequered">
              🏁
            </span>
          ) : (
            countryAndDate.date.toLocaleDateString("fr-FR")
          )}
        </td>
      </tr>
    );
  });

  return (
    <div id="ranking">
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="vacc-type"
          name="vacc-type"
          value={vaccType}
          onChange={handleVaccTypeChange}
        >
          <FormControlLabel
            value="primo"
            control={<Radio />}
            label="First injections"
          />
          <FormControlLabel
            value="full"
            control={<Radio />}
            label="Full vaccinations"
          />
        </RadioGroup>
      </FormControl>
      <table>
        <tr>
          <th>Country</th>
          <th>Projected vaccine-induced herd immunity</th>
        </tr>
        {countryRows.slice(0, 15)}
      </table>
    </div>
  );
}

export default Ranking;
