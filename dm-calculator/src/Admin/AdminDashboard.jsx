import React, { useEffect, useState } from "react";
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
import AdminClientDetails from "./AdminClientDetails";
import AdminAddServices from "./AdminAddServices";
import AdminServicesHistory from "./AdminServicesHistory";
import AdminAdsCampign from "./AdminAdsCampign";
import AdminCalculator from "./AdminCalculator";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("clients");
  // const [selectedService, setSelectedService] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const userName = currentUser?.name;

  // Sample data

  // const clients = [
  //   {
  //     id: 1,
  //     name: "Acme Corporation",
  //     contact: "John Smith",
  //     email: "john@acme.com",
  //     phone: "+1 (555) 123-4567",
  //     location: "New York, NY",
  //     status: "Active",
  //     lastContact: "2024-06-05",
  //     value: "$125,000",
  //   },
  //   {
  //     id: 2,
  //     name: "TechStart Inc",
  //     contact: "Sarah Wilson",
  //     email: "sarah@techstart.com",
  //     phone: "+1 (555) 987-6543",
  //     location: "San Francisco, CA",
  //     status: "Prospect",
  //     lastContact: "2024-06-03",
  //     value: "$85,000",
  //   },
  //   {
  //     id: 3,
  //     name: "Global Solutions",
  //     contact: "Mike Johnson",
  //     email: "mike@globalsol.com",
  //     phone: "+1 (555) 456-7890",
  //     location: "Chicago, IL",
  //     status: "Active",
  //     lastContact: "2024-06-01",
  //     value: "$200,000",
  //   },
  // ];

  // const services = [
  //   {
  //     id: 1,
  //     name: "Web Development",
  //     price: "$5,000 - $25,000",
  //     duration: "4-12 weeks",
  //   },
  //   {
  //     id: 2,
  //     name: "Mobile App Development",
  //     price: "$10,000 - $50,000",
  //     duration: "8-20 weeks",
  //   },
  //   {
  //     id: 3,
  //     name: "Digital Marketing",
  //     price: "$2,000 - $10,000",
  //     duration: "3-6 months",
  //   },
  //   {
  //     id: 4,
  //     name: "Brand Identity Design",
  //     price: "$3,000 - $15,000",
  //     duration: "3-8 weeks",
  //   },
  //   {
  //     id: 5,
  //     name: "E-commerce Solution",
  //     price: "$8,000 - $35,000",
  //     duration: "6-16 weeks",
  //   },
  //   {
  //     id: 6,
  //     name: "Consulting Services",
  //     price: "$150 - $300/hour",
  //     duration: "Ongoing",
  //   },
  // ];

  const history = [
    {
      id: 1,
      date: "2024-06-05",
      client: "Acme Corporation",
      action: "Service Delivered",
      service: "Web Development",
      status: "Completed",
      amount: "$15,000",
    },
    {
      id: 2,
      date: "2024-06-04",
      client: "TechStart Inc",
      action: "Proposal Sent",
      service: "Mobile App Development",
      status: "Pending",
      amount: "$25,000",
    },
    {
      id: 3,
      date: "2024-06-03",
      client: "Global Solutions",
      action: "Contract Signed",
      service: "Digital Marketing",
      status: "Active",
      amount: "$8,000",
    },
    {
      id: 4,
      date: "2024-06-02",
      client: "Acme Corporation",
      action: "Meeting Scheduled",
      service: "Brand Identity Design",
      status: "Scheduled",
      amount: "$12,000",
    },
    {
      id: 5,
      date: "2024-06-01",
      client: "TechStart Inc",
      action: "Initial Contact",
      service: "E-commerce Solution",
      status: "Follow-up",
      amount: "$30,000",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "prospect":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "follow-up":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // const SelectService = () => (
  //   <div className="space-y-6">
  //     <div className="flex justify-between items-center">
  //       <h2 className="text-2xl font-bold text-gray-900">Select Service</h2>
  //       <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
  //         <Plus className="w-4 h-4" />
  //         Add Service
  //       </button>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {services.map((service) => (
  //         <div
  //           key={service.id}
  //           className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1 ${
  //             selectedService === service.name
  //               ? "border-blue-500 bg-blue-50"
  //               : "border-gray-200"
  //           }`}
  //           onClick={() => setSelectedService(service.name)}
  //         >
  //           <div className="p-6">
  //             <div className="flex items-start justify-between mb-4">
  //               <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
  //                 <CheckCircle className="w-6 h-6 text-white" />
  //               </div>
  //               {selectedService === service.name && (
  //                 <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
  //                   <CheckCircle className="w-4 h-4 text-white" />
  //                 </div>
  //               )}
  //             </div>
  //             <h3 className="font-bold text-lg text-gray-900 mb-2">
  //               {service.name}
  //             </h3>
  //             <div className="space-y-2 text-sm text-gray-600">
  //               <div className="flex items-center gap-2">
  //                 <span className="font-medium">Price:</span>
  //                 <span>{service.price}</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Clock className="w-4 h-4" />
  //                 <span>{service.duration}</span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>

  //     {selectedService && (
  //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  //         <h3 className="text-lg font-semibold mb-4">Service Configuration</h3>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Selected Service
  //             </label>
  //             <input
  //               type="text"
  //               value={selectedService}
  //               readOnly
  //               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Client
  //             </label>
  //             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
  //               <option value="">Select Client</option>
  //               {clients.map((client) => (
  //                 <option key={client.id} value={client.id}>
  //                   {client.name}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Start Date
  //             </label>
  //             <input
  //               type="date"
  //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Budget
  //             </label>
  //             <input
  //               type="text"
  //               placeholder="Enter budget"
  //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //             />
  //           </div>
  //           <div className="md:col-span-2">
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Notes
  //             </label>
  //             <textarea
  //               rows="3"
  //               placeholder="Add any additional notes or requirements..."
  //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //             ></textarea>
  //           </div>
  //         </div>
  //         <div className="mt-6 flex gap-3">
  //           <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  //             Create Proposal
  //           </button>
  //           <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
  //             Save Draft
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  const History = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">History</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Activities</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Active</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search history..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        {item.client}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-700">{item.action}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-700">{item.service}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">
                        {item.amount}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Total Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">8</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">$485K</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">24</div>
            <div className="text-sm text-gray-600">Completed Projects</div>
          </div>
        </div>
      </div>
    </div>
  );

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
              { id: "services", label: "Calculate Service", icon: ListChecks },
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
        {activeTab === "services" && <AdminCalculator />}
        {activeTab === "AddADSCamp" && <AdminAdsCampign />}
        {activeTab === "AddServices" && <AdminAddServices />}
        {activeTab === "servicehistory" && <AdminServicesHistory />}
        {activeTab === "history" && <History />}
      </main>
    </div>
  );
};

export default AdminDashboard;
