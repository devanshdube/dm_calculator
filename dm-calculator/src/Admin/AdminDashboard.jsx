import React, { lazy, useEffect, useState } from "react";
import {
  User,
  Clock,
  CheckCircle,
  Plus,
  LogOut,
  Menu,
  X,
  ShieldPlus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { clearUser } from "../redux/user/userSlice";
const AllHistory = lazy(() => import("./AllHistory"));
const RegisterBD = lazy(() => import("./RegisterBD"));
const AdminClientDetails = lazy(() => import("./AdminClientDetails"));
const AdminAddServices = lazy(() => import("./AdminAddServices"));
const AdminServicesHistory = lazy(() => import("./AdminServicesHistory"));
const AdminAdsCampign = lazy(() => import("./AdminAdsCampign"));
// const AdminCalculator = lazy(() => import("./AdminCalculator"));

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("clients");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("activeTab", tabId);
    setMobileMenuOpen(false); // Close mobile menu on tab change
  };

  const tabs = [
    { id: "clients", label: "Client Details", icon: User },
    // { id: "AddADSCamp", label: "Add Ads Campaigns", icon: CheckCircle },
    { id: "AddADSCamp", label: "Campaigns", icon: CheckCircle },
    // { id: "AddServices", label: "Add Graphic Services", icon: Plus },
    { id: "AddServices", label: "Graphic", icon: Plus },
    { id: "servicehistory", label: "Graphic Service History", icon: Clock },
    { id: "registerbd", label: "Register BD", icon: ShieldPlus },
    { id: "history", label: "History", icon: Clock },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
        dispatch(clearUser());
        Swal.fire({
          title: "Logged Out!",
          text: "You have successfully logged out.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Control Panel
              </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* User Info - Hidden on small screens */}
              <div className="hidden sm:block text-right">
                <div className="text-xs sm:text-sm text-gray-400">
                  Welcome back,
                </div>
                <div className="font-semibold text-white text-sm sm:text-base">
                  {currentUser.name}
                </div>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              {/* Logout Button - Hidden on mobile */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Desktop */}
      <nav className="hidden lg:block relative z-10 bg-gray-800/20 backdrop-blur-xl border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 xl:space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-400 bg-purple-500/10"
                      : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{tab.label}</span>
                  <span className="xl:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden relative z-20 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-gray-800/95 backdrop-blur-xl border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 border-t border-gray-700/50 mt-4 pt-4"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === "clients" && <AdminClientDetails />}
          {activeTab === "registerbd" && <RegisterBD />}
          {activeTab === "AddADSCamp" && <AdminAdsCampign />}
          {activeTab === "AddServices" && <AdminAddServices />}
          {activeTab === "servicehistory" && <AdminServicesHistory />}
          {activeTab === "history" && <AllHistory />}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Alternative) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-800/95 backdrop-blur-xl border-t border-gray-700/50">
        <div className="flex justify-around py-2">
          {tabs.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-purple-400 bg-purple-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">
                  {tab.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
