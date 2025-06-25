import React from "react";
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

const History = () => {
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
  return (
    <>
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
              <div className="text-3xl font-bold text-purple-600 mb-1">
                $485K
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">24</div>
              <div className="text-sm text-gray-600">Completed Projects</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
