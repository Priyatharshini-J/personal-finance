/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
} from "lucide-react";
import { Transaction } from "../types";
import axios from "axios";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import LoadingSpinner from "../ui/LoadingSpinner";
import AddTransactionDialog, {
  NewTransaction,
} from "../ui/AddTransactionDialog";
import ConfirmDialog from "../ui/ConfirmDialog";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

interface TransactionsProps {
  userId: string | number;
}

const Transactions: React.FC<TransactionsProps> = (userId) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, isLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editing, setEditing] = useState<NewTransaction | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 8;

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(transactions.length / transactionsPerPage);
    setCurrentPage((prev) => Math.min(prev + 1, maxPage));
  };

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const fetchAllData = async () => {
    try {
      const transactionsRes = await axios.get(BASE_URL + "/getTransactions", {
        params: {
          userId: userId.userId,
        },
      });
      setAllTransactions(transactionsRes.data.finalData);
      setTransactions(transactionsRes.data.finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyFilters = (
    filterType = filter,
    term = searchTerm,
    date = dateRange[0]
  ) => {
    let filtered = allTransactions;

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.Type === filterType);
    }

    if (term) {
      filtered = filtered.filter(
        (t) =>
          t.Description.toLowerCase().includes(term.toLowerCase()) ||
          t.Category.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (date.startDate && date.endDate) {
      const start = date.startDate.getTime();
      const end = date.endDate.getTime();
      filtered = filtered.filter((t) => {
        const txTime = new Date(t.transactionDate).getTime();
        return txTime >= start && txTime <= end;
      });
    }

    setTransactions(filtered);
  };

  const handleFilterChange = (newFilter: "all" | "income" | "expense") => {
    setFilter(newFilter);

    // Reset date range for "All"
    if (newFilter === "all") {
      setDateRange([
        { ...dateRange[0], startDate: undefined, endDate: undefined },
      ]);
    }

    applyFilters(newFilter, searchTerm, dateRange[0]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(filter, term, dateRange[0]);
  };

  const handleDateRangeChange = (ranges: any) => {
    const selection = ranges.selection;
    setDateRange([selection]);

    // Apply filters only when both dates selected
    if (selection.startDate && selection.endDate) {
      setShowCalendar(false);
      applyFilters(filter, searchTerm, selection);
    }
  };

  const handleClearFilters = () => {
    setFilter("all");
    setSearchTerm("");
    setDateRange([
      { startDate: undefined, endDate: undefined, key: "selection" },
    ]);
    setTransactions(allTransactions);
  };

  const handleSave = async (tx: NewTransaction) => {
    if (tx.id) {
      await axios.put(BASE_URL + "/editTransaction", {
        ROWID: tx.id,
        transactionDate: tx.Date,
        Description: tx.Description,
        Category: tx.Category,
        Amount: tx.Amount,
        Type: tx.Type,
        userId: userId.userId,
      });
    } else {
      await axios.post(BASE_URL + "/addTransaction", {
        transactionDate: tx.Date,
        Description: tx.Description,
        Category: tx.Category,
        Amount: tx.Amount,
        Type: tx.Type,
        userId: userId.userId,
      });
    }
    isLoading(true);
    fetchAllData();
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/deleteTransaction/${id}`);
      const updated = transactions.filter((t) => t.ROWID !== id);
      setTransactions(updated);
      setAllTransactions(updated);
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">Transactions</h2>

            <div className="flex flex-col md:flex-row gap-3 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>

              <div className="flex space-x-2">
                {["all", "income", "expense"].map((f) => (
                  <button
                    key={f}
                    className={`px-4 py-2 rounded-lg border ${
                      filter === f
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      handleFilterChange(f as "all" | "income" | "expense")
                    }
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <button
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarDays size={20} />
                </button>

                {(filter !== "all" || searchTerm || dateRange[0].startDate) && (
                  <button
                    className="ml-2 px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                )}
              </div>

              {showCalendar && (
                <div
                  ref={calendarRef}
                  className="absolute top-14 right-0 z-50 shadow-lg bg-white rounded"
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleDateRangeChange}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    maxDate={new Date()}
                  />
                </div>
              )}

              <button
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                onClick={() => {
                  setEditing(null);
                  setShowAddDialog(true);
                }}
              >
                <Plus size={18} />
                <span>Add Transaction</span>
              </button>
              <AddTransactionDialog
                userId={userId.userId}
                open={showAddDialog}
                initialData={editing ?? undefined} // ✅ must pass editing object
                onClose={() => setShowAddDialog(false)}
                onSave={handleSave}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.ROWID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.transactionDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.Description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.Category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span
                    className={
                      transaction.Type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }
                  >
                    {transaction.Type === "income" ? "+" : "-"}$
                    {transaction.Amount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.Type === "income"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {transaction.Type === "income" ? (
                      <ArrowUpRight size={12} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={12} className="mr-1" />
                    )}
                    {transaction.Type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      if (transaction.userId === null) {
                        toast.error(
                          "Editing mock data is not allowed. Check console for further modifications."
                        );
                        console.warn(
                          "Attempted to edit a default/shared category with null userId."
                        );
                        return;
                      }
                      setEditing({
                        id: transaction.ROWID,
                        Date: new Date(transaction.transactionDate)
                          .toISOString()
                          .slice(0, 10),
                        Description: transaction.Description,
                        Category: transaction.Category,
                        Amount: transaction.Amount,
                        Type: transaction.Type,
                      });
                      setShowAddDialog(true);
                    }}
                    className="text-emerald-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (transaction.userId === null) {
                        toast.error(
                          "Deleting mock data is not allowed. Check console for further modifications."
                        );
                        console.warn(
                          "Attempted to edit a default/shared category with null userId."
                        );
                        return;
                      }
                      setConfirmDeleteId(transaction.ROWID);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                  <ConfirmDialog
                    open={confirmDeleteId !== null}
                    message="Are you sure you want to delete this transaction?"
                    onClose={() => setConfirmDeleteId(null)}
                    onConfirm={() => {
                      if (confirmDeleteId) {
                        handleDelete(confirmDeleteId);
                        setConfirmDeleteId(null);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No transactions found.</p>
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * transactionsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * transactionsPerPage, transactions.length)}
          </span>{" "}
          of <span className="font-medium">{transactions.length}</span>{" "}
          transactions
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage >=
              Math.ceil(transactions.length / transactionsPerPage)
            }
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              currentPage >=
              Math.ceil(transactions.length / transactionsPerPage)
                ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
