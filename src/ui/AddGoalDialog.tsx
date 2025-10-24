import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

interface AddGoalDialogProps {
  userId: string | number;
  onClose: () => void;
  fetchDataAgain: () => void;
  editingCategory?: {
    id: string;
    name: string;
    current: number;
    target: number;
    targetDate: string;
    color: string;
  };
}

const AddGoalDialog: React.FC<AddGoalDialogProps> = ({
  userId,
  onClose,
  fetchDataAgain,
  editingCategory,
}) => {
  const [name, setName] = useState(editingCategory?.name || "");
  const [current, setCurrent] = useState(editingCategory?.current || "");
  const [target, setTarget] = useState(editingCategory?.target || "");
  const [targetDate, setTargetDate] = useState(
    editingCategory?.targetDate || ""
  );
  const [color, setColor] = useState(editingCategory?.color || "#00BFFF");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !current || !target || !targetDate) {
      setError("All fields are required");
      return;
    }

    const payload = {
      ROWID: editingCategory?.id || "",
      name,
      currentAmount: Number(current),
      targetAmount: Number(target),
      targetDate: new Date(targetDate),
      color,
      userId,
    };
    try {
      if (editingCategory?.id) {
        await axios.put(BASE_URL + "/editSavingsGoal", payload);
      } else {
        await axios.post(BASE_URL + "/addSavingsGoal", payload);
      }
      fetchDataAgain();
      onClose();
    } catch (err) {
      console.error("Error adding/editing goal:", err);
      setError("Failed to add category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingCategory?.id ? "Edit Goal" : "Add New Goal"}
        </h2>

        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1">Goal name</label>
          <input
            type="text"
            placeholder="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md p-2"
          />
          <label className="block text-sm font-medium mb-1">
            Current Amount
          </label>
          <input
            type="number"
            placeholder="Current Amount"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full border rounded-md p-2"
          />
          <label className="block text-sm font-medium mb-1">
            Target Amount
          </label>
          <input
            type="number"
            placeholder="Target Amount"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full border rounded-md p-2"
          />

          <label className="block text-sm font-medium mb-1">Target Date</label>
          <input
            type="date"
            name="Date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

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
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGoalDialog;
