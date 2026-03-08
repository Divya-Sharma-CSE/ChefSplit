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
          "#f8adbd",
          "#c0def3",
          "#ffe195",
          "#9fbebe",
          "#9b8db7",
          "#ceb69d",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default ExpensePieChart;