import React from "react";
import {
  getNumberOfVaccinationsPerDayPerRegion,
  getRegionPopulation,
  getRemainingToBeVaccinatedPopulation,
  getVaccinatedPopulationByRegion,
} from "../model/Model";
import VaccineChart from "./VaccineChart";

export default function CountryCard(props: any) {
  return (
    <div className="country-card">
      <VaccineChart country={props.region} data={props.data} />
      <br/>
      <p>
        Daily vaccinations:{" "}
        <span className="number">
          {Math.round(
            getNumberOfVaccinationsPerDayPerRegion(
              props.daysPeriod,
              props.region,
              props.data
            )
          ).toLocaleString()}
        </span>
        /day
      </p>
      <p>
        Total vaccinations to this day:{" "}
        <span className="number">
          {getVaccinatedPopulationByRegion(
            props.region,
            props.data
          ).toLocaleString()}
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
          ).toLocaleString()}
        </span>
      </p>
      <p>
        Total population:{" "}
        <span className="number">
          {getRegionPopulation(props.region).toLocaleString()}
        </span>
      </p>
    </div>
  );
}
