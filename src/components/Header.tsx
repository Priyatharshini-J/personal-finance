/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

type User = {
  email_id: string;
  first_name: string;
  last_name: string;
  user_type: string;
};

const Header: React.FC = () => {
  const [user, setUser] = useState<User>({
    email_id: "",
    first_name: "",
    last_name: "",
    user_type: "",
  });

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const catalyst = (window as any).catalyst;
    const userManagement = catalyst.userManagement;
    const currentUserPromise = userManagement.getCurrentProjectUser();
    currentUserPromise
      .then((response: any) => {
        setUser(response.content);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user.first_name ? `${user.first_name} ` : ""}
        </p>
      </div>

      <div className="flex items-center space-x-4 relative">
        {/* <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div> */}

        {/* Avatar with Dropdown */}
        <div className="relative">
          <div
            className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white cursor-pointer"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <User size={20} />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-77 bg-white shadow-lg rounded-xl p-5 z-50 border">
              <h3 className="text-lg font-semibold text-center mb-2">
                My Account
              </h3>
              <p className="text-sm text-center text-gray-500 truncate">
                {user.email_id}
              </p>

              <div className="flex justify-center my-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={32} className="text-gray-500" />
                </div>
              </div>

              <p className="text-center font-medium text-lg">
                Hi, {user.first_name} {user.last_name}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
