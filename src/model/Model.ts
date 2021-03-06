import { populations } from "../data/country-by-population";

const sumReducer = (a: number, b: number) => a + b;

const world_population = populations
  .map((country) => country.population)
  .reduce(sumReducer);

export const dateCompare = (a: any, b: any) => {
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
  let daysToVaccinate =
    speed > 0 ? Math.round(remainingSusceptiblePopulation / speed) : 400;
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

export function getRegionPopulation(region: string): number {
  let result: number = 0;
  const regionPopulation = populations.find(
    (element) => element.country === region
  )?.population;
  if (regionPopulation !== undefined) result = regionPopulation;
  return result;
}

export function getNumberOfVaccinationsPerDayPerRegion(
  daysPeriod: number,
  region: string,
  vaccinationData: any[]
): number {
  let regionData = vaccinationData.filter((v) => v.location === region);
  regionData.sort(dateCompare);
  let interval_size = Math.min(daysPeriod, regionData.length - 1) + 1;
  regionData = regionData.slice(0, interval_size);
  let vaccPerDay =
    regionData.length > 0
      ? (regionData[0]?.total_vaccinations -
        regionData[interval_size - 1]?.total_vaccinations) /
        interval_size - 1
      : 4000000;
  return vaccPerDay;
}

export function getVaccinatedPopulationByRegion(
  region: string,
  vaccinationData: any[]
): number {
  let regionData = vaccinationData.filter((v) => v.location === region);
  regionData.sort(dateCompare);
  let result = regionData.length > 0 ? regionData[0].total_vaccinations : 0;
  return result;
}

export function getAvailableCountries(vaccinationData: any[]): string[] {
  let populationCountries = populations.map((p) => p.country);
  let vaccinatedCountries = vaccinationData
    .filter((p) => p.people_fully_vaccinated != null)
    .map((p) => p.location);
  let result = populationCountries.filter(
    (country) =>
      vaccinatedCountries.includes(country) &&
      getRegionPopulation(country) >= 1000000
  );
  return result;
}

export function formatChartData(data: any[], region: string) {
  let dataArray = data
    .filter((e) => e.location === region && e.total_vaccinations !== undefined)
    .map((e) => {
      let result = { x: e.date.slice(0, 10), y: e.total_vaccinations };
      return result;
    });
  return [{ id: region, data: dataArray }];
}
