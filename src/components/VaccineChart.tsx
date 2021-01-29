import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ReferenceLine,
  Brush,
} from "recharts";
import { formatDateAxis, getFirstDaysOfMonths } from "../model/ChartUtils";

export default function VaccineChart(props: any) {
  const data = props.data;
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
      projected_vaccinations: totalVaccinations + props.dailyVaccinations * i,
    });
    projectionDate.setDate(projectionDate.getDate() + 1);
    i++;
  }

  dataWithProjection.map(e => {
    e['total_vaccinations_per_population'] = e['total_vaccinations'] * (100/props.regionPopulation); 
    e['projected_vaccinations_per_population'] = e['projected_vaccinations'] * (100/props.regionPopulation); 
    return e; 
  })

  let threshold = props.threshold * 100 / props.regionPopulation; 

  return (
    <LineChart data={dataWithProjection} width={650} height={400}>
      <CartesianGrid stroke="#b3cdd1ff" />
      <XAxis
        dataKey="date"
        tickFormatter={formatDateAxis}
        ticks={getFirstDaysOfMonths(dataWithProjection)}
      />
      <YAxis
        interval="preserveEnd"
        domain={["auto", "auto"]}
        allowDecimals={false}
        tickFormatter={(e) => e.toString() + "%"}
      />
      <Line
        type="monotone"
        dataKey="total_vaccinations_per_population"
        stroke="#6c464fff"
        strokeWidth={3}
        dot={false}
      />
      <Line
        type="dashed"
        dataKey="projected_vaccinations_per_population"
        dot={false}
        stroke="#6c464fff"
        strokeDasharray="3 3"
      />
      <ReferenceLine
        y={threshold}
        stroke="orange"
        strokeDasharray="3 3"
        strokeWidth={3}
      />
      <Tooltip />
      <Brush height={20} />
    </LineChart>
  );
}
