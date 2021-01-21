import { ResponsiveLine } from "@nivo/line";
import { formatChartData } from "../model/Model";
export default function VaccineChart(props: any) {
  return (
    <ResponsiveLine
      data={formatChartData(props.data, props.country)}
      margin={{ top: 20, right: 60, bottom: 30, left: 60 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        useUTC: false,
        precision: "day",
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: "linear",
        stacked: false,
      }}
      axisLeft={{
        legend: "linear scale",
        legendOffset: 12,
      }}
      axisBottom={{
        format: "%b %d",
        tickValues: "every 2 days",
        legend: "time scale",
        legendOffset: -12,
      }}
      pointSize={16}
      pointBorderWidth={1}
      pointBorderColor={{
        from: "color",
        modifiers: [["darker", 0.3]],
      }}
      useMesh={true}
      enableSlices={false}
    />
  );
}
