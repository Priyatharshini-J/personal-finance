/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BudgetCategory } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseBreakdownProps {
  categories: BudgetCategory[];
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ categories }) => {
  const sortedCategories = [...categories].sort(
    (a, b) =>
      parseFloat(b.spent as unknown as string) -
      parseFloat(a.spent as unknown as string)
  );

  const data = {
    labels: sortedCategories.map((cat) => cat.name),
    datasets: [
      {
        label: "Expenses",
        data: sortedCategories.map((cat) =>
          parseFloat(cat.spent as unknown as string)
        ),
        backgroundColor: sortedCategories.map((cat) => cat.color),
        borderColor: sortedCategories.map((cat) => cat.color),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: $${value}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "$" + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const totalSpent = categories.reduce(
    (sum, cat) => sum + parseFloat(cat.spent as unknown as string),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Expense Breakdown
        </h3>
        <p className="text-sm font-medium text-gray-500">
          Total: <span className="text-gray-800">${totalSpent}</span>
        </p>
      </div>

      <div className="h-64 mb-4">
        <Bar data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {sortedCategories.map((category) => (
          <div key={category.ROWID} className="flex items-start space-x-2">
            <div
              className="w-3 h-3 rounded-full mt-1.5"
              style={{ backgroundColor: category.color }}
            ></div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {category.name}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">${category.spent}</p>
                <p className="text-xs text-gray-500">
                  (
                  {Math.round(
                    (parseFloat(category.spent as unknown as string) /
                      totalSpent) *
                      100
                  )}
                  %)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
