import React, { useEffect, useRef } from "react";
import {
  getAvailableCountries,
  getNumberOfVaccinationsPerDayPerRegion,
  getEndDate,
  dateCompare,
} from "../model/Model";

function Ranking(props: any) {
  let { data } = props;

  const dataRef = useRef(data);

  dataRef.current = data.map((x: any) => {
    return {
      ...x,
      total_vaccinations: x.total_vaccinations - x.people_fully_vaccinated,
    };
  });

  let todaysDate = new Date();
  let availableCountries = getAvailableCountries(dataRef.current);

  let countriesRanked = availableCountries
    ?.map((country) => {
      let dailyVaccPerRegion = getNumberOfVaccinationsPerDayPerRegion(
        2,
        country,
        dataRef.current
      );
      let endDate = getEndDate(
        dailyVaccPerRegion,
        0.6,
        country,
        dataRef.current
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
