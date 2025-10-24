import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { BASE_URL } from "../constants";

export type Category = { name: string; color: string };

export interface NewTransaction {
  id?: string; // ← optional, present on edit
  Date: string;
  Description: string;
  Category: string;
  Amount: number;
  Type: string;
}

interface Props {
  userId: string | number;
  open: boolean;
  initialData?: NewTransaction; // ← use this to prefill form on edit
  onClose: () => void;
  onSave: (tx: NewTransaction) => Promise<void>; // will handle both add/edit
}

const AddTransactionDialog: React.FC<Props> = ({
  userId,
  open,
  initialData,
  onClose,
  onSave,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<NewTransaction>({
    Date: new Date().toISOString().slice(0, 10),
    Description: "",
    Category: "",
    Amount: 0,
    Type: "expense",
  });
  const [saving, setSaving] = useState(false);

  // When dialog opens or initialData changes, prefill:
  useEffect(() => {
    if (initialData) {
      setForm(initialData); // this sets the form fields when edit is triggered
    } else {
      // reset if adding new
      setForm({
        Date: new Date().toISOString().slice(0, 10),
        Description: "",
        Category: "",
        Amount: 0,
        Type: "expense",
      });
    }
    // fetch categories once
    axios
      .get(BASE_URL + "/getCategories", {
        params: {
          userId: userId,
        },
      })
      .then((res) => setCategories(res.data.finalData))
      .catch(() => setCategories([]));
  }, [open, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "Amount" ? Number(value) : value,
    }));
  };

  const toggleType = (type: "income" | "expense") =>
    setForm((f) => ({ ...f, Type: type }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="Date"
              value={form.Date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              name="Description"
              value={form.Description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="Category"
              value={form.Category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="Amount"
              value={form.Amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Type */}
          <div>
            <span className="block text-sm font-medium mb-1">Type</span>
            <div className="flex space-x-2">
              {(["income", "expense"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`px-4 py-2 rounded-lg border font-medium ${
                    form.Type === t
                      ? t === "income"
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                        : "bg-rose-100 border-rose-300 text-rose-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionDialog;
