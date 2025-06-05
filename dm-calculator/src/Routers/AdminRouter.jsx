import React from "react";
import { Link } from "react-router-dom";

export default function AdminRouter() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add BD */}
        <Link
          to="/admin/add-bd"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Add BD</h2>
          <p className="text-gray-500 text-sm">Create a new BD user</p>
        </Link>

        {/* Add Services */}
        <Link
          to="/admin/services"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Add Services
          </h2>
          <p className="text-gray-500 text-sm">
            Manage services, categories, editing types
          </p>
        </Link>

        {/* Ads Setting */}
        <Link
          to="/admin/ads"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Ads Settings
          </h2>
          <p className="text-gray-500 text-sm">
            Set ads category, amount, and percentage
          </p>
        </Link>
      </div>
    </div>
  );
}
