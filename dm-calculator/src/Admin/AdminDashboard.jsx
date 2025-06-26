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
              // { id: "history", label: "History", icon: Clock },
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
        {/* {activeTab === "history" && <History />} */}
      </main>
    </div>
  );
};

export default AdminDashboard;

// import React, { lazy, useEffect, useState } from "react";
// import {
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Plus,
//   Search,
//   Filter,
//   LogOut,
//   Briefcase,
//   ListChecks,
//   Menu,
//   X,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { clearUser } from "../redux/user/userSlice";
// import History from "./History";
// const AdminClientDetails = lazy(() => import("./AdminClientDetails"));
// const AdminAddServices = lazy(() => import("./AdminAddServices"));
// const AdminServicesHistory = lazy(() => import("./AdminServicesHistory"));
// const AdminAdsCampign = lazy(() => import("./AdminAdsCampign"));
// // const AdminCalculator = lazy(() => import("./AdminCalculator"));

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("clients");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Mock user data - replace with your Redux selector
//   const userName = "Admin User";

//   useEffect(() => {
//     const savedTab = localStorage.getItem("activeTab");
//     if (savedTab) {
//       setActiveTab(savedTab);
//     }
//   }, []);

//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//     localStorage.setItem("activeTab", tabId);
//     setMobileMenuOpen(false); // Close mobile menu on tab change
//   };

//   const handleLogout = () => {
//     // Mock logout - replace with your Swal implementation
//     console.log("Logout clicked");
//   };

//   const tabs = [
//     { id: "clients", label: "Client Details", icon: User },
//     { id: "AddADSCamp", label: "Add Ads Campaigns", icon: CheckCircle },
//     { id: "AddServices", label: "Add Graphic Services", icon: Plus },
//     { id: "servicehistory", label: "Graphic Service History", icon: Clock },
//   ];

//   // Mock components - replace with your actual components
//   // const AdminClientDetails = () => (
//   //   <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
//   //     <h3 className="text-2xl font-bold text-white mb-4">Client Details</h3>
//   //     <p className="text-gray-300">Client management content goes here...</p>
//   //   </div>
//   // );

//   const AdminAdsCampign = () => (
//     <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
//       <h3 className="text-2xl font-bold text-white mb-4">Add Ads Campaigns</h3>
//       <p className="text-gray-300">Ads campaign content goes here...</p>
//     </div>
//   );

//   const AdminAddServices = () => (
//     <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
//       <h3 className="text-2xl font-bold text-white mb-4">
//         Add Graphic Services
//       </h3>
//       <p className="text-gray-300">Add services content goes here...</p>
//     </div>
//   );

//   const AdminServicesHistory = () => (
//     <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
//       <h3 className="text-2xl font-bold text-white mb-4">
//         Graphic Service History
//       </h3>
//       <p className="text-gray-300">Service history content goes here...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       {/* Header */}
//       <header className="relative z-10 bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                 Control Panel
//               </h1>
//             </div>

//             <div className="flex items-center gap-3 sm:gap-4">
//               {/* User Info - Hidden on small screens */}
//               <div className="hidden sm:block text-right">
//                 <div className="text-xs sm:text-sm text-gray-400">
//                   Welcome back,
//                 </div>
//                 <div className="font-semibold text-white text-sm sm:text-base">
//                   {userName}
//                 </div>
//               </div>

//               {/* Avatar */}
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
//                 <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//               </div>

//               {/* Logout Button - Hidden on mobile */}
//               <button
//                 onClick={handleLogout}
//                 className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 backdrop-blur-sm"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span className="hidden lg:inline">Logout</span>
//               </button>

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
//               >
//                 {mobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Navigation Tabs - Desktop */}
//       <nav className="hidden lg:block relative z-10 bg-gray-800/20 backdrop-blur-xl border-b border-gray-700/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex space-x-6 xl:space-x-8">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => handleTabChange(tab.id)}
//                   className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
//                     activeTab === tab.id
//                       ? "border-purple-500 text-purple-400 bg-purple-500/10"
//                       : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span className="hidden xl:inline">{tab.label}</span>
//                   <span className="xl:hidden">{tab.label.split(" ")[0]}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Navigation Menu */}
//       <div
//         className={`lg:hidden relative z-20 ${
//           mobileMenuOpen ? "block" : "hidden"
//         }`}
//       >
//         <div className="bg-gray-800/95 backdrop-blur-xl border-b border-gray-700/50">
//           <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => handleTabChange(tab.id)}
//                   className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
//                     activeTab === tab.id
//                       ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
//                       : "text-gray-300 hover:text-white hover:bg-gray-700/50"
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {tab.label}
//                 </button>
//               );
//             })}

//             {/* Mobile Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 border-t border-gray-700/50 mt-4 pt-4"
//             >
//               <LogOut className="w-5 h-5" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
//         <div className="transition-all duration-300 ease-in-out">
//           {activeTab === "clients" && <AdminClientDetails />}
//           {activeTab === "AddADSCamp" && <AdminAdsCampign />}
//           {activeTab === "AddServices" && <AdminAddServices />}
//           {activeTab === "servicehistory" && <AdminServicesHistory />}
//         </div>
//       </main>

//       {/* Mobile Bottom Navigation (Alternative) */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-800/95 backdrop-blur-xl border-t border-gray-700/50">
//         <div className="flex justify-around py-2">
//           {tabs.slice(0, 4).map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => handleTabChange(tab.id)}
//                 className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-300 ${
//                   activeTab === tab.id
//                     ? "text-purple-400 bg-purple-500/20"
//                     : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span className="text-xs font-medium">
//                   {tab.label.split(" ")[0]}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
