import React from "react";
import {
  getAvailableCountries,
  getNumberOfVaccinationsPerDayPerRegion,
  getEndDate,
  dateCompare,
} from "../model/Model";

function Ranking(props: any) {
  let { data } = props;

  let availableCountries = getAvailableCountries(data);

  let countriesRanked = availableCountries?.map((country) => {
    let dailyVaccPerRegion = getNumberOfVaccinationsPerDayPerRegion(
      1,
      country,
      "Full",
      data
    );
    let endDate = getEndDate(dailyVaccPerRegion, 0.7, country, data);
    let countryAndEndDate = { country: country, date: endDate };
    return countryAndEndDate;
  });

  countriesRanked.sort(dateCompare).reverse();

  let countryRows: JSX.Element[] = countriesRanked.map((countryAndDate) => {
    return (
      <tr key={countryAndDate.country}>
        <td>{countryAndDate.country}</td>
        <td>{countryAndDate.date.toLocaleDateString("fr-FR")}</td>
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
