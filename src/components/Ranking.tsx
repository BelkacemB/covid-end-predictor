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
      data
    );
    let endDate = getEndDate(dailyVaccPerRegion, 0.7, country, data);
    let countryAndEndDate = { country: country, date: endDate };
    return countryAndEndDate;
  });

  countriesRanked.sort(dateCompare);

  let jsxCountryElements: JSX.Element[] = countriesRanked.map(
    (countryAndDate) => {
      return (
        <p key={countryAndDate.country}>
          Country: {countryAndDate.country}, end date:{" "}
          {countryAndDate.date.toLocaleDateString("fr-FR")}
        </p>
      );
    }
  );

  return <div>{jsxCountryElements}</div>;
}

export default Ranking;
