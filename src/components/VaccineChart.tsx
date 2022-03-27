import { formatDateAxis, getFirstDaysOfMonths } from "../model/ChartUtils";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function VaccineChart(props: any) {

  const data = props.data;
  let svgRef = useRef(null);
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

  let threshold = (props.threshold * 100) / props.regionPopulation;

  const margin = { top: 20, right: 20, bottom: 20, left: 80 },
    fullWidth = 800,
    fullHeight = 300,
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom;

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", fullWidth)
      .attr("height", fullHeight)
      .style('background-color', '#f5f5f5')

    const x = d3
      .scaleTime()
      .domain([
        d3.min(dataWithProjection, (d: any) => d.date),
        d3.max(dataWithProjection, (d: any) => d.date),
      ])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataWithProjection, (d: any) => d.projected_vaccinations),
      ])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).ticks(4).tickFormat(
      (d: any) => formatDateAxis(d)
    )
   
    const yAxis = d3.axisLeft(y).ticks(100)

    const line = d3
      .line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.total_vaccinations))
      .curve(d3.curveCardinal);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .call(yAxis)

    svg
      .append("path")
      .data([dataWithProjection])
      .attr("fill", "none")
      .attr('d', line)
      .attr("stroke", "black")
  }, [dataWithProjection]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>

  );
}
