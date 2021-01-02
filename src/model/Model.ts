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
  let remainingSusceptiblePopulation = getRemainingToBeVaccinatedPopulation(
    threshold,
    region,
    data
  );
  let daysToVaccinate = Math.round(remainingSusceptiblePopulation / speed);
  result.setDate(result.getDate() + daysToVaccinate);
  return result;
}

export function getRemainingToBeVaccinatedPopulation(
  threshold: number,
  region: string,
  data: any[]
) {
  return (
    threshold * (getRegionPopulation(region) ?? world_population) -
    getVaccinatedPopulationByRegion(region, data)
  );
}

export function getRegionPopulation(region: string) {
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
  regionData.sort(compare);
  regionData = regionData.slice(0, daysPeriod);
  let totalDailyVaccinations =
    regionData.length > 0
      ? regionData.map((day) => day.daily_vaccinations).reduce(sumReducer)
      : 1000;
  let vaccPerDay = totalDailyVaccinations / daysPeriod;
  return vaccPerDay;
}

export function getVaccinatedPopulationByRegion(
  region: string,
  vaccinationData: any[]
) {
  let regionData = vaccinationData.filter((v) => v.location === region);
  regionData.sort(compare);
  let result = regionData.length > 0 ? regionData[0].total_vaccinations : 0;
  return result;
}

export function getAvailableCountries(vaccinationData: any[]): string[] {
  // Don't forget to push
  let populationCountries = populations.map((p) => p.country);
  let vaccinatedCountries = vaccinationData.map((p) => p.location);
  let result = populationCountries.filter((country) =>
    vaccinatedCountries.includes(country)
  );
  result.push("World");
  return result;
}
