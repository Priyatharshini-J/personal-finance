/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Savings from "./pages/Savings";
import Goals from "./pages/Goals";
import LoadingSpinner from "./ui/LoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Help from "./pages/Help";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isFetching, setIsFetching] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const Zcatalyst = (window as any).catalyst;
    Zcatalyst.auth
      .isUserAuthenticated()
      .then((response: any) => {
        setIsUserAuthenticated(true);
        setUserId(response.content.user_id);
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard userId={userId} />;
      case "transactions":
        return <Transactions userId={userId} />;
      case "budget":
        return <Budget userId={userId} />;
      case "savings":
        return <Savings userId={userId} />;
      case "goals":
        return <Goals userId={userId} />;
      case "help":
        return <Help />;
      default:
        return <Dashboard userId={userId} />;
    }
  };

  const toggleLogout = () => {
    const redirectURL = "/";
    const auth = (window as any).catalyst.auth;
    auth.signOut(redirectURL);
  };

  return (
    <>
      {isFetching ? (
        <LoadingSpinner />
      ) : isUserAuthenticated ? (
        <div className="flex h-screen bg-gray-100">
          <ToastContainer />
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            toggleLogout={toggleLogout}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto p-6">{renderPage()}</main>
          </div>
        </div>
      ) : (
        (window.location.href = "/__catalyst/auth/login")
      )}
    </>
  );
}

export default App;
