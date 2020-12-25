const world_population: number = 7800000000;

const compare = (a: any, b: any) => {
  if (a.date > b.date) return -1;
  else return 1;
};

export function getEndDate(
  speed: number,
  threshold: number,
  data: any[]
): Date {
  let result = new Date();
  let remainingSusceptiblePopulation =
    (world_population - getVaccinatedPopulationByRegion("World", data)) *
    threshold;
  let daysToVaccinate = Math.round(remainingSusceptiblePopulation / speed);
  result.setDate(result.getDate() + daysToVaccinate);
  return result;
}

export function getNumberOfVaccinationsPerDayPerRegion(
  daysPeriod: number,
  region: string,
  vaccinationData: any[]
): number {
  let regionData = vaccinationData.filter((v) => v.location === region);

  regionData.sort(compare);
  let vaccPerDay = regionData.length > 0 ? 
    (regionData[0].total_vaccinations -
      regionData[daysPeriod].total_vaccinations) /
    daysPeriod : 400000;
  return vaccPerDay;
}

function getVaccinatedPopulationByRegion(
  region: string,
  vaccinationData: any[]
) {
  let regionData = vaccinationData.filter((v) => v.location === region);
  regionData.sort(compare);
  let result = regionData.length > 0 ? regionData[0].total_vaccinations : 0
  return result;
}
