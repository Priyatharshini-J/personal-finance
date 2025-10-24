import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { BASE_URL } from "../constants";

interface AddBudgetCategoryProps {
  userId: string | number;
  onClose: () => void;
  fetchDataAgain: () => void;
  editingCategory?: {
    id: string;
    name: string;
    budgeted: number;
    spent: number;
    color: string;
  };
}

const AddBudgetCategory: React.FC<AddBudgetCategoryProps> = ({
  userId,
  onClose,
  fetchDataAgain,
  editingCategory,
}) => {
  const [name, setName] = useState(editingCategory?.name || "");
  const [budgeted, setBudgeted] = useState(editingCategory?.budgeted || "");
  const [spent, setSpent] = useState(editingCategory?.spent || "");
  const [color, setColor] = useState(editingCategory?.color || "#2EB51C"); // default emerald
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !budgeted || !spent || !color) {
      setError("All fields are required");
      return;
    }

    const payload = {
      ROWID: editingCategory?.id || "",
      name,
      budgeted,
      spent,
      color,
      userId,
    };

    try {
      if (editingCategory?.id) {
        await axios.put(`${BASE_URL}/editBudgetCategory`, payload);
      } else {
        await axios.post(BASE_URL + "/addBudgetCategory", payload);
      }
      fetchDataAgain();
      onClose();
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editingCategory?.id ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budgeted ($)
            </label>
            <input
              type="number"
              value={budgeted}
              onChange={(e) => setBudgeted(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spent ($)
            </label>
            <input
              type="number"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 block w-16 h-10 border-gray-300 shadow-sm rounded"
            />
            <span className="text-sm text-gray-700">{color.toUpperCase()}</span>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetCategory;
