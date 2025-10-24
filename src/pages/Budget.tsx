/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
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
import axios from "axios";
import LoadingSpinner from "../ui/LoadingSpinner";
import { BudgetCategory } from "../types";
import AddBudgetCategory from "../ui/AddBudgetCategory";
import ConfirmDialog from "../ui/ConfirmDialog";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BudgetProps {
  userId: string | number;
}

const Budget: React.FC<BudgetProps> = (userId) => {
  // Calculate total budget and spent
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(
    []
  );
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    | {
        id: string;
        name: string;
        budgeted: number;
        spent: number;
        color: string;
      }
    | undefined
  >(undefined);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, isLoading] = useState(true);

  const fetchBudget = async () => {
    try {
      const budgetsRes = await axios.get(BASE_URL + "/getBudgetCategories", {
        params: {
          userId: userId.userId,
        },
      });
      setBudgetCategories(budgetsRes.data.finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchDataAgain = async () => {
    isLoading(true);
    fetchBudget();
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/deleteBudgetCategory/${id}`);
      const updated = budgetCategories.filter((x) => x.ROWID !== id);
      setBudgetCategories(updated);
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const totalBudgeted = budgetCategories.reduce((sum, cat) => {
    const val = parseFloat(cat.budgeted as unknown as string) || 0;
    return sum + val;
  }, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => {
    const val = parseFloat(cat.spent as unknown as string) || 0;
    return sum + val;
  }, 0);
  const remainingBudget = totalBudgeted - totalSpent;
  const percentUsed =
    totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  // Prepare chart data
  const chartData = {
    labels: budgetCategories.map((cat) => cat.name),
    datasets: [
      {
        label: "Budget",
        data: budgetCategories.map((cat) => cat.budgeted),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Spent",
        data: budgetCategories.map((cat) => cat.spent),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: $${value}`;
          },
        },
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
    },
  };
  if (loading) return <LoadingSpinner />;
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Monthly Budget</h2>
            <p className="text-gray-500">
              Track your spending against your budget
            </p>
          </div>
          <button
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            onClick={() => {
              setShowAddCategoryDialog(true);
            }}
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
          {showAddCategoryDialog && (
            <AddBudgetCategory
              userId={userId.userId}
              onClose={() => {
                setShowAddCategoryDialog(false);
                setEditingCategory(undefined);
              }}
              fetchDataAgain={fetchDataAgain}
              editingCategory={editingCategory}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Budget
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              ${totalBudgeted.toLocaleString()}
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Spent
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              ${totalSpent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {percentUsed}% of budget used
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Remaining
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              ${remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="h-80 mb-8">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Budget Categories
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budgeted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetCategories.map((category) => {
                const spent = parseFloat(category.spent as unknown as string);
                const budget = parseFloat(
                  category.budgeted as unknown as string
                );
                const remaining = budget - spent;
                const percentUsed = Math.round((spent / budget) * 100);
                const isOverBudget = spent > budget;
                return (
                  <tr key={category.ROWID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${category.budgeted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${category.spent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={
                          isOverBudget
                            ? "text-rose-600 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {isOverBudget ? "-" : ""}${Math.abs(remaining)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              isOverBudget ? "bg-rose-500" : ""
                            }`}
                            style={{
                              width: `${Math.min(100, percentUsed)}%`,
                              backgroundColor: isOverBudget
                                ? undefined
                                : category.color,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                          {percentUsed}%
                        </span>
                        {isOverBudget && (
                          <AlertCircle
                            size={16}
                            className="ml-1 text-rose-500"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                        onClick={() => {
                          if (category.userId === null) {
                            toast.error(
                              "Editing mock data is not allowed. Check console for further modifications."
                            );
                            console.warn(
                              "Attempted to edit a default/shared category with null userId."
                            );
                            return;
                          }
                          setEditingCategory({
                            id: category.ROWID,
                            name: category.name,
                            budgeted: category.budgeted,
                            spent: category.spent,
                            color: category.color,
                          });
                          setShowAddCategoryDialog(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-rose-600 hover:text-rose-900"
                        onClick={() => {
                          if (category.userId === null) {
                            toast.error(
                              "Deleting mock data is not allowed. Check console for further modifications."
                            );
                            console.warn(
                              "Attempted to edit a default/shared category with null userId."
                            );
                            return;
                          }
                          setDeleteId(category.ROWID);
                          setShowDeleteDialog(true);
                        }}
                      >
                        Delete
                      </button>
                      <ConfirmDialog
                        open={deleteId !== null}
                        message="Are you sure you want to delete this budget category?"
                        onClose={() => setDeleteId(null)}
                        onConfirm={() => {
                          if (deleteId) {
                            handleDelete(deleteId);
                            setDeleteId(null);
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Budget;
