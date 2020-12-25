import { populations } from "../data/country-by-population";

const sumReducer = (a: number, b: number) => a + b;

const world_population = populations
  .map((country) => country.population)
  .reduce(sumReducer);

const compare = (a: any, b: any) => {
  if (a.date > b.date) return -1;
  else return 1;
};

export function getEndDate(
  speed: number,
  threshold: number,
  region: string,
  data: any[]
): Date {
  let result = new Date();
  let remainingSusceptiblePopulation =
    threshold * (getRegionPopulation(region) ?? world_population) -
    getVaccinatedPopulationByRegion(region, data);
  let daysToVaccinate = Math.round(remainingSusceptiblePopulation / speed);
  result.setDate(result.getDate() + daysToVaccinate);
  return result;
}

function getRegionPopulation(region: string) {
  if (region === "World") return world_population;
  else
    return populations.find((element) => element.country === region)
      ?.population;
}

export function getNumberOfVaccinationsPerDayPerRegion(
  daysPeriod: number,
  region: string,
  vaccinationData: any[]
): number {
  let regionData = vaccinationData.filter((v) => v.location === region);
  let interval_size = Math.min(daysPeriod, regionData.length - 1);
  regionData.sort(compare);
  let vaccPerDay =
    regionData.length > 0
      ? (regionData[0].total_vaccinations -
          regionData[interval_size].total_vaccinations) /
        interval_size
      : 400000;
  return vaccPerDay;
}

function getVaccinatedPopulationByRegion(
  region: string,
  vaccinationData: any[]
) {
  let regionData = vaccinationData.filter((v) => v.location === region);
  regionData.sort(compare);
  let result = regionData.length > 0 ? regionData[0].total_vaccinations : 0;
  return result;
}
