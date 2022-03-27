import { formatDateAxis, getFirstDaysOfMonths } from "../model/ChartUtils";
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { select } from 'd3-selection';
import { useRef } from "react";

export default function VaccineChart(props: any) {
  
  const data = props.data;
  let chart = useRef(null);
  let dataWithProjection = [...data];

  // What's the typeof date object?
  const totalVaccinations =
    dataWithProjection[dataWithProjection.length - 1].total_vaccinations;
  dataWithProjection[dataWithProjection.length - 1].projected_vaccinations =
    dataWithProjection[dataWithProjection.length - 1].total_vaccinations;

  let projectionDate = new Date(
    dataWithProjection[dataWithProjection.length - 1].date
  );
  projectionDate.setDate(projectionDate.getDate() + 1);
  let i = 1;
  while (projectionDate <= props.endDate) {
    dataWithProjection.push({
      date: new Date(projectionDate),
      projected_vaccinations:
        totalVaccinations + (props.dailyVaccinations) * i,
    });
    projectionDate.setDate(projectionDate.getDate() + 1);
    i++;
  }

  dataWithProjection.map((e) => {
    e["total_vaccinations_per_population"] =
      e["total_vaccinations"] * (100 / props.regionPopulation);
    e["projected_vaccinations_per_population"] =
      e["projected_vaccinations"] * (100 / props.regionPopulation);
    return e;
  });

  const margin = { top: 20, right: 20, bottom: 20, left: 80 },
  fullWidth = 800,
  fullHeight = 300,
  width = fullWidth - margin.left - margin.right,
  height = fullHeight - margin.top - margin.bottom;

  let threshold = (props.threshold * 100) / props.regionPopulation;

  return (
    <svg
      ref={chart}
      height="100%"
      width="100%"
      viewBox={`0 0 ${fullWidth} ${fullHeight}`}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g className="axis x" transform={`translate(0, ${height})`} />
        <g className="axis y" />
        <path className="line baseline" />
        <path className="line actual" />
      </g>
    </svg>
  );
}
