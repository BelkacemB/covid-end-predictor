import React from "react";
import {
  getNumberOfVaccinationsPerDayPerRegion,
  getRegionPopulation,
  getRemainingToBeVaccinatedPopulation,
  getVaccinatedPopulationByRegion,
} from "../model/Model";
import VaccineChart from "../components/VaccineChart";

export default function CountryCard(props: any) {
  let countryData = props.data.filter(
    (x: any) =>
      x.location === props.region && x.total_vaccinations !== undefined
  );

  let regionPopulation = getRegionPopulation(props.region);

  let dailyVaccinations = Math.round(
    getNumberOfVaccinationsPerDayPerRegion(
      props.daysPeriod,
      props.region,
      props.data
    )
  );

  return (
    <div className="country-card">
      <div id="vac-chart">
        <VaccineChart
          data={countryData}
          endDate={props.endDate}
          threshold={props.threshold * regionPopulation}
          dailyVaccinations={dailyVaccinations}
          regionPopulation={regionPopulation}
        />
      </div>
      <br />
      <p>
        Daily vaccinations:{" "}
        <span className="number">{dailyVaccinations.toLocaleString()}</span>
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
        <span className="number">{regionPopulation.toLocaleString()}</span>
      </p>
    </div>
  );
}
