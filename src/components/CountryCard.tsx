import React from "react";
import {
  getEndDate,
  getNumberOfVaccinationsPerDayPerRegion,
  getRegionPopulation,
  getRemainingToBeVaccinatedPopulation,
  getVaccinatedPopulationByRegion,
  getAvailableCountries,
} from "../model/Model";

export default function CountryCard(props: any) {
  return (
    <div className="country-card">
      <p>
        Daily vaccinations:{" "}
        <span className="number">
          {Math.round(
            getNumberOfVaccinationsPerDayPerRegion(
              props.daysPeriod,
              props.region,
              props.data
            )
          )}
        </span>
        /day
      </p>
      <p>
        Total vaccinations to this day:{" "}
        <span className="number">
          {getVaccinatedPopulationByRegion(props.region, props.data)}
        </span>
      </p>
      <p>
        Remaining population to be vaccinated:{" "}
        <span className="number">
          {Math.round(
            getRemainingToBeVaccinatedPopulation(
              props.threshold,
              props.region,
              props.data
            )
          )}
        </span>
      </p>
      <p>
        Total population:{" "}
        <span className="number">{getRegionPopulation(props.region)}</span>
      </p>
    </div>
  );
}
