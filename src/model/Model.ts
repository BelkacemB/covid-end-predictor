const world_population: number = 7800000000;
const vaccinated_population: number = 2341871;

export function getEndDate(speed: number, threshold: number): Date {
  let result = new Date();
  let remainingSusceptiblePopulation =
    (world_population - vaccinated_population) * threshold;
  let daysToVaccinate = Math.round(remainingSusceptiblePopulation / speed);
  result.setDate(result.getDate() + daysToVaccinate);
  return result;
}

export function getNumberOfVaccinationsPerDay(daysPeriod: number): number {
  return 150000;
}
