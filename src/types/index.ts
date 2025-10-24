export interface Transaction {
  userId: null;
  ROWID: string;
  transactionDate: string;
  Amount: number;
  Category: string;
  Description: string;
  Type: string;
}

export interface BudgetCategory {
  userId: null;
  ROWID: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface SavingsGoal {
  userId: null;
  ROWID: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color: string;
}

export interface MonthlyOverview {
  Financial_month : string;
  income: number;
  expenses: number;
  savings: number;
}