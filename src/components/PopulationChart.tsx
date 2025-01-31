import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PopulationChartProps {
  populationCounts: { year: number; value: number }[];
}

const PopulationChart = ({ populationCounts }: PopulationChartProps) => {
  const chartData = {
    labels: populationCounts.map((data) => data.year.toString()),
    datasets: [
      {
        label: "Population",
        data: populationCounts.map((data) => data.value),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} options={{responsive: true, maintainAspectRatio: true, resizeDelay: 1}}/>;
};

export default PopulationChart;
