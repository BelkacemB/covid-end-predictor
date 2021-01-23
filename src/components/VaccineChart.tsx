import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Brush
} from "recharts";

export default function VaccineChart(props: any) {
  return (
    <LineChart data={props.data} width={650} height={400} >
    <CartesianGrid stroke="#b3cdd1ff" />
    <XAxis
      dataKey="date"
    />
    <YAxis
      interval="preserveEnd"
      domain={["auto", "auto"]}
      allowDecimals={false}
    />
    <Line type="monotone" dataKey="total_vaccinations" stroke=" #6c464fff" dot={{ stroke: '#9e768fff', strokeWidth: 3 }} />
    <Tooltip />
    <Brush height={20} />
  </LineChart>
  );
}
