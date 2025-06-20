import { Line } from "react-chartjs-2";

const MonthlyRevenueChart = ({ stats }) => {
  const labels = stats.map((m) => m.month);
  const data = stats.map((m) => m.revenue);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Monthly Revenue</h3>
      <div className="h-64">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Revenue",
                data,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `$${value}`,
                },
              },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;
