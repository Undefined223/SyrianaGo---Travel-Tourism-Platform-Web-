import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, // for x-axis (categories like months)
  LinearScale,   // for y-axis (numbers)
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);


const MonthlyBookingsChart = ({ stats }) => {
  const labels = stats.map((m) => m.month);
  const data = stats.map((m) => m.bookings);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Monthly Bookings</h3>
      <div className="h-64">
        <Bar
          data={{
            labels,
            datasets: [{ label: "Bookings", data, backgroundColor: "#3b82f6", borderRadius: 8 }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MonthlyBookingsChart;
