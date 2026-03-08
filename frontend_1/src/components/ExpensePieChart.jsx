import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ expenses }) => {
  const data = {
    labels: expenses.map((e) => e.category),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((e) => e.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default ExpensePieChart;