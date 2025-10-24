import React from "react";
import { TrendingUp, TrendingDown, Percent, DollarSign } from "lucide-react";

interface OverviewCardsProps {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({
  income,
  expenses,
  savings,
  savingsRate,
}) => {
  const cards = [
    {
      title: "Total Income",
      value: `$${income.toLocaleString()}`,
      icon: <TrendingUp size={20} className="text-emerald-500" />,
      change: "+5.2%",
      changeType: "positive",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Total Expenses",
      value: `$${expenses.toLocaleString()}`,
      icon: <TrendingDown size={20} className="text-rose-500" />,
      change: "+2.4%",
      changeType: "negative",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
    {
      title: "Total Savings",
      value: `$${savings.toLocaleString()}`,
      icon: <DollarSign size={20} className="text-blue-500" />,
      change: "+12.3%",
      changeType: "positive",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate}%`,
      icon: <Percent size={20} className="text-purple-500" />,
      change: "+3.1%",
      changeType: "positive",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 shadow-sm`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
