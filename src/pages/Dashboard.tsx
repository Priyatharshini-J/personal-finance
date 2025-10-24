import React, { useEffect, useState } from "react";
import axios from "axios";
import OverviewCards from "../components/dashboard/OverviewCards";
import ExpenseBreakdown from "../components/dashboard/ExpenseBreakdown";
import MonthlyTrend from "../components/dashboard/MonthlyTrend";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import SavingsProgress from "../components/dashboard/SavingsProgress";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  BudgetCategory,
  MonthlyOverview,
  SavingsGoal,
  Transaction,
} from "../types";
import { BASE_URL } from "../constants";

interface Props {
  userId: string | number;
}

const Dashboard: React.FC<Props> = (userId) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(
    []
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [monthlyOverview, setMonthlyOverview] = useState<MonthlyOverview[]>([]);

  const [loading, isLoading] = useState(true);
  const fetchAllData = async () => {
    try {
      const [
        transactionsRes,
        budgetCategoriesRes,
        savingsGoalsRes,
        monthlyOverviewRes,
      ] = await Promise.all([
        axios.get(BASE_URL + "/getTransactions", {
          params: {
            userId: userId.userId,
          },
        }),
        axios.get(BASE_URL + "/getBudgetCategories", {
          params: {
            userId: userId.userId,
          },
        }),
        axios.get(BASE_URL + "/getSavingsGoal", {
          params: {
            userId: userId.userId,
          },
        }),
        axios.get(BASE_URL + "/getMonthlyOverview", {
          params: {
            userId: userId.userId,
          },
        }),
      ]);
      setTransactions(transactionsRes.data.finalData);
      setBudgetCategories(budgetCategoriesRes.data.finalData);
      setSavingsGoals(savingsGoalsRes.data.finalData);
      setMonthlyOverview(monthlyOverviewRes.data.finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading(false);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, []);

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => t.Type === "income")
      .reduce((sum, t) => sum + parseFloat(t.Amount as unknown as string), 0);

    const expenses = transactions
      .filter((t) => t.Type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.Amount as unknown as string), 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      income,
      expenses,
      savings,
      savingsRate: Math.round(savingsRate),
    };
  };

  const totals = calculateTotals();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <OverviewCards
        income={totals.income}
        expenses={totals.expenses}
        savings={totals.savings}
        savingsRate={totals.savingsRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseBreakdown categories={budgetCategories} />
        <MonthlyTrend data={monthlyOverview} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecentTransactions transactions={transactions} />
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SavingsProgress goals={savingsGoals} />
            <BudgetProgress categories={budgetCategories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
