const world_population: number = 7800000000;
const vaccinated_population: number = 2341871;

export function getEndDate(speed: number, threshold: number): number {
  let remainingSusceptiblePopulation =
    (world_population - vaccinated_population) * threshold;
  let daysToVaccinate = Math.round(remainingSusceptiblePopulation / speed);

  return daysToVaccinate;
}

export function getNumberOfVaccinationsPerDay(daysPeriod: number): number {
  return 3000000;
}
