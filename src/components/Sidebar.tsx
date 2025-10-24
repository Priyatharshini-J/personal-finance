import React from "react";
import {
  Home,
  BarChart3,
  PiggyBank,
  CreditCard,
  Target,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  toggleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  toggleLogout,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    {
      id: "transactions",
      label: "Transactions",
      icon: <CreditCard size={20} />,
    },
    { id: "budget", label: "Budget", icon: <BarChart3 size={20} /> },
    { id: "savings", label: "Savings", icon: <PiggyBank size={20} /> },
    { id: "goals", label: "Goals", icon: <Target size={20} /> },
  ];

  const bottomMenuItems = [
    { id: "help", label: "Help", icon: <HelpCircle size={20} /> },
    { id: "logout", label: "Logout", icon: <LogOut size={20} /> },
  ];

  return (
    <div className="bg-gray-900 text-white h-screen w-64 flex flex-col">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <PiggyBank size={24} className="text-emerald-400" />
          <h1 className="text-xl font-bold">FinTrack</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Personal Finance Dashboard</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activePage === item.id
                    ? "bg-emerald-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <ul className="space-y-1">
          {bottomMenuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (item.id === "logout") {
                    toggleLogout(); // 👈 call logout function
                  } else {
                    setActivePage(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  activePage === item.id
                    ? "bg-emerald-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
