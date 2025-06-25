import React, { lazy, useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  LogOut,
  Briefcase,
  ListChecks,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { clearUser } from "../redux/user/userSlice";
import History from "./History";
const AdminClientDetails = lazy(() => import("./AdminClientDetails"));
const AdminAddServices = lazy(() => import("./AdminAddServices"));
const AdminServicesHistory = lazy(() => import("./AdminServicesHistory"));
const AdminAdsCampign = lazy(() => import("./AdminAdsCampign"));
// const AdminCalculator = lazy(() => import("./AdminCalculator"));

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("clients");
  // const [selectedService, setSelectedService] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const userName = currentUser?.name;

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("activeTab", tabId);
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Control Panel
              </h1>
              {/* <p className="text-gray-600">Admin Dashboard</p> */}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Welcome back,</div>
                <div className="font-semibold text-gray-900">{userName}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: "clients", label: "Client Details", icon: User },
              // { id: "services", label: "Calculate Service", icon: ListChecks },
              {
                id: "AddADSCamp",
                label: "Add Ads campaigns",
                icon: CheckCircle,
              },
              {
                id: "AddServices",
                label: "Add Graphic Services",
                icon: CheckCircle,
              },
              {
                id: "servicehistory",
                label: "Graphic Service History",
                icon: Clock,
              },
              { id: "history", label: "History", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "clients" && <AdminClientDetails />}
        {/* {activeTab === "services" && <AdminCalculator />} */}
        {activeTab === "AddADSCamp" && <AdminAdsCampign />}
        {activeTab === "AddServices" && <AdminAddServices />}
        {activeTab === "servicehistory" && <AdminServicesHistory />}
        {activeTab === "history" && <History />}
      </main>
    </div>
  );
};

export default AdminDashboard;
