import React from "react";
import { BudgetCategory } from "../../types";

interface BudgetProgressProps {
  categories: BudgetCategory[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ categories }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Budget Progress</h3>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const spent = parseFloat(category.spent as unknown as string);
          const budgeted = parseFloat(category.budgeted as unknown as string);
          const progressPercent = Math.min(100, (spent / budgeted) * 100);
          const isOverBudget = spent > budgeted;

          return (
            <div key={category.ROWID} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-800">
                  {category.name}
                </h4>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    ${spent.toLocaleString()} / ${budgeted.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs ${
                      isOverBudget ? "text-rose-500" : "text-gray-500"
                    }`}
                  >
                    {isOverBudget
                      ? "Over budget"
                      : `${progressPercent.toFixed(0)}% used`}
                  </p>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isOverBudget ? "bg-rose-500" : ""
                  }`}
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: isOverBudget ? undefined : category.color,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;
