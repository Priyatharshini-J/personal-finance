import React from "react";
import { Mail, Phone, Info } from "lucide-react";

const Help: React.FC = () => {
  const faqs = [
    {
      question: "How do I add a new transaction?",
      answer:
        "Click the 'Add Transaction' button on the Transactions page and fill in the required details like date, amount, category, and type.",
    },
    {
      question: "How do I set a monthly budget?",
      answer:
        "Go to the Budget section and click on 'Add Category' to define your budgeted amount for each category.",
    },
    {
      question: "Can I edit or delete a transaction?",
      answer:
        "Yes, click the Edit or Delete option next to the transaction. If it's a default entry, editing might be restricted.",
    },
    {
      question: "How is savings progress calculated?",
      answer:
        "Savings progress is calculated based on the target and current amount set for each savings goal.",
    },
    {
      question: "What if I forget to log an expense?",
      answer:
        "You can backdate a transaction by selecting the correct date while adding or editing a transaction.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Info size={28} className="text-emerald-500" />
        Help & Support
      </h1>

      <p className="text-gray-600 mb-6">
        Find answers to frequently asked questions and reach out to us if you
        need further assistance.
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-4">
          {faqs.map((faq, index) => (
            <li key={index} className="border border-gray-200 rounded-md p-4">
              <p className="font-medium text-gray-900">{faq.question}</p>
              <p className="text-gray-600 mt-1">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
        <p className="text-gray-600 mb-2">
          If your issue isn’t listed above, feel free to contact us directly.
        </p>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-center gap-2">
            <Mail size={18} className="text-emerald-500" />
            support@fintrackapp.com
          </li>
          <li className="flex items-center gap-2">
            <Phone size={18} className="text-emerald-500" />
            +91 98765 43210
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
