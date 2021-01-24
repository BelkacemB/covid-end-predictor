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

export default function VaccineChart(props: any) {
  let dataWithProjection = props.data;
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
      date: projectionDate,
      projected_vaccinations: totalVaccinations + props.dailyVaccinations * i,
    });
    projectionDate.setDate(projectionDate.getDate() + 1);
    i++;
  }

  return (
    <LineChart data={dataWithProjection} width={650} height={400}>
      <CartesianGrid stroke="#b3cdd1ff" />
      <XAxis dataKey="date" />
      <YAxis
        interval="preserveEnd"
        domain={["auto", "auto"]}
        allowDecimals={false}
      />
      <Line
        type="monotone"
        dataKey="total_vaccinations"
        stroke=" #6c464fff"
        dot={{ stroke: "#9e768fff", strokeWidth: 3 }}
      />
      <Line type="dashed" dataKey="projected_vaccinations" />
      <ReferenceLine y={props.threshold} stroke="green" strokeDasharray="3 3" />
      <Tooltip />
      <Brush height={20} />
    </LineChart>
  );
}
