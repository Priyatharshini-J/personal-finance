/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";
import { SavingsGoal } from "../types";
import axios from "axios";
import LoadingSpinner from "../ui/LoadingSpinner";
import AddGoalDialog from "../ui/AddGoalDialog";
import ConfirmDialog from "../ui/ConfirmDialog";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  userId: string | number;
}

const Goals: React.FC<Props> = (userId) => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    | {
        id: string;
        name: string;
        current: number;
        target: number;
        targetDate: string;
        color: string;
      }
    | undefined
  >(undefined);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, isLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [savingsGoalsRes] = await Promise.all([
        axios.get(BASE_URL + "/getSavingsGoal", {
          params: {
            userId: userId.userId,
          },
        }),
      ]);
      setSavingsGoals(savingsGoalsRes.data.finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchDataAgain = async () => {
    isLoading(true);
    fetchAllData();
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/deleteSavingsGoal/${id}`);
      const updated = savingsGoals.filter((x) => x.ROWID !== id);
      setSavingsGoals(updated);
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };
  // Calculate total goal amounts and progress
  const totalTargetAmount = savingsGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const totalCurrentAmount = savingsGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );
  const overallProgress = Math.round(
    (totalCurrentAmount / totalTargetAmount) * 100
  );

  // Prepare chart data
  const chartData = {
    labels: savingsGoals.map((goal) => goal.name),
    datasets: [
      {
        data: savingsGoals.map((goal) => goal.currentAmount),
        backgroundColor: savingsGoals.map((goal) => goal.color),
        borderColor: savingsGoals.map((goal) => goal.color),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            // const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${percentage}%`;
          },
        },
      },
    },
    cutout: "70%",
  };
  if (loading) return <LoadingSpinner />;
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Financial Goals</h2>
            <p className="text-gray-500">
              Track your progress towards your financial goals
            </p>
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            <span>Create New Goal</span>
          </button>
          {showAddDialog && (
            <AddGoalDialog
              userId={userId.userId}
              onClose={() => {
                setShowAddDialog(false);
                setEditingCategory(undefined);
              }}
              fetchDataAgain={fetchDataAgain}
              editingCategory={editingCategory}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative h-64 w-64">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">
                  {overallProgress}%
                </span>
                <span className="text-sm text-gray-500">Overall Progress</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500">
                Total Saved:{" "}
                <span className="font-medium">
                  ${totalCurrentAmount.toLocaleString()}
                </span>
              </p>
              <p className="text-gray-500">
                Target:{" "}
                <span className="font-medium">
                  ${totalTargetAmount.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Goal Summary
            </h3>
            <div className="space-y-4">
              {savingsGoals.map((goal) => {
                const progressPercent = Math.min(
                  100,
                  (goal.currentAmount / goal.targetAmount) * 100
                );

                return (
                  <div
                    key={goal.ROWID}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: goal.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-800">
                        {goal.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">
                        ${goal.currentAmount.toLocaleString()} / $
                        {goal.targetAmount.toLocaleString()}
                      </span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor: goal.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.map((goal) => {
          const progressPercent = Math.min(
            100,
            (goal.currentAmount / goal.targetAmount) * 100
          );
          const daysLeft = Math.ceil(
            (new Date(goal.targetDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const monthsLeft = Math.ceil(daysLeft / 30);
          const amountLeft = goal.targetAmount - goal.currentAmount;
          const monthlyContributionNeeded =
            monthsLeft > 0 ? Math.ceil(amountLeft / monthsLeft) : 0;

          return (
            <div
              key={goal.ROWID}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {goal.name}
                </h4>
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${goal.color}20` }}
                >
                  <Target size={20} style={{ color: goal.color }} />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium">
                    {progressPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: goal.color,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-gray-500 mb-1">
                    <DollarSign size={14} className="mr-1" />
                    <span className="text-xs">Current</span>
                  </div>
                  <p className="text-lg font-semibold">
                    ${goal.currentAmount.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Target size={14} className="mr-1" />
                    <span className="text-xs">Target</span>
                  </div>
                  <p className="text-lg font-semibold">
                    ${goal.targetAmount.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar size={14} className="mr-1" />
                    <span className="text-xs">Timeline</span>
                  </div>
                  <p className="text-lg font-semibold">{monthsLeft} months</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-gray-500 mb-1">
                    <TrendingUp size={14} className="mr-1" />
                    <span className="text-xs">Monthly Need</span>
                  </div>
                  <p className="text-lg font-semibold">
                    ${monthlyContributionNeeded}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p>
                  Target Date:{" "}
                  <span className="font-medium">{goal.targetDate}</span>
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  onClick={() => {
                    if (goal.userId === null) {
                      toast.error(
                        "Editing mock data is not allowed. Check console for further modifications."
                      );
                      console.warn(
                        "Attempted to edit a default/shared category with null userId."
                      );
                      return;
                    }
                    setEditingCategory({
                      id: goal.ROWID,
                      name: goal.name,
                      current: goal.currentAmount,
                      target: goal.targetAmount,
                      targetDate: goal.targetDate,
                      color: goal.color,
                    });
                    setShowAddDialog(true);
                  }}
                >
                  Edit Goal
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 text-red-700 rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    if (goal.userId === null) {
                      toast.error(
                        "Editing mock data is not allowed. Check console for further modifications."
                      );
                      console.warn(
                        "Attempted to edit a default/shared category with null userId."
                      );
                      return;
                    }
                    setDeleteId(goal.ROWID);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 />
                </button>
                <ConfirmDialog
                  open={deleteId !== null}
                  message="Are you sure you want to delete this goal?"
                  onClose={() => setDeleteId(null)}
                  onConfirm={() => {
                    if (deleteId) {
                      handleDelete(deleteId);
                      setDeleteId(null);
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
