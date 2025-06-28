import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const AdminAddServices = () => {
  const baseURL = "https://dm.calculator.one-realty.in";
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editingTypeName, setEditingTypeName] = useState("");
  const [editingTypeAmount, setEditingTypeAmount] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  console.log(categories);

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getAddServices`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServices(res.data.data);
    } catch (error) {
      console.log("Error fetching services:", error);
      Swal.fire("Error", "Failed to fetch services", "error");
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          dispatch(clearUser());
          localStorage.removeItem("token");
          navigate("/");
        });
      }
    }
  };

  const fetchCategories = async (service_id) => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/categories/${service_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(res.data.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
      // Swal.fire("Error", "Failed to fetch categories", "error");
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          dispatch(clearUser());
          localStorage.removeItem("token");
          navigate("/");
        });
      }
    }
  };

  const addService = async () => {
    if (!serviceName.trim()) {
      return Swal.fire("Validation", "Service name is required", "warning");
    }
    try {
      const res = await axios.post(
        `${baseURL}/auth/api/calculator/addServices`,
        {
          service_name: serviceName,
        }
      );
      Swal.fire("Success", res.data.message, "success");
      setServiceName("");
      fetchServices();
    } catch (err) {
      console.log("Error adding service:", err);

      Swal.fire("Error", "Could not add service", "error");
    }
  };

  const addCategory = async () => {
    if (!selectedServiceId || !categoryName.trim()) {
      return Swal.fire(
        "Validation",
        "Select service and enter category name",
        "warning"
      );
    }
    try {
      const res = await axios.post(
        `${baseURL}/auth/api/calculator/addCategories`,
        {
          service_id: selectedServiceId,
          category_name: categoryName,
        }
      );
      Swal.fire("Success", res.data.message, "success");
      setCategoryName("");
      fetchCategories(selectedServiceId);
    } catch (err) {
      console.log("Error adding category:", err);

      Swal.fire("Error", "Could not add category", "error");
    }
  };

  const addEditingType = async () => {
    if (
      !selectedServiceId ||
      !selectedCategoryId ||
      !editingTypeName.trim() ||
      !editingTypeAmount.trim()
    ) {
      return Swal.fire("Validation", "All fields are required", "warning");
    }
    try {
      const res = await axios.post(
        `${baseURL}/auth/api/calculator/addEditingTypes`,
        {
          service_id: selectedServiceId,
          category_id: selectedCategoryId,
          editing_type_name: editingTypeName,
          amount: editingTypeAmount,
        }
      );
      Swal.fire("Success", res.data.message, "success");
      setEditingTypeName("");
    } catch (err) {
      console.log("Error adding editing type:", err);

      Swal.fire("Error", "Could not add editing type", "error");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-10">
        <div className="lg:col-span-2 space-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-300">
            🎛️ Graphic Service Management Panel
          </h2>

          {/* Add Service */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              ➕ Add New Service
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter Service Name"
                className="w-full sm:flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addService}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Add Service
              </button>
            </div>
          </div>

          {/* Add Category */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              📁 Add Category
            </h3>
            <div className="space-y-3">
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedServiceId(val);
                  setSelectedCategoryId("");
                  setCategories([]);
                  if (val) fetchCategories(val);
                }}
                value={selectedServiceId}
              >
                <option value="">-- Select Service --</option>
                {services.map((s) => (
                  <option key={s.service_id} value={s.service_id}>
                    {s.service_name}
                  </option>
                ))}
              </select>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter Category Name"
                  className="w-full sm:flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                />
                <button
                  onClick={addCategory}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>

          {/* Add Editing Type */}
          {categories.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                ✂️ Add Editing Type
              </h3>
              <div className="space-y-3">
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  value={selectedCategoryId}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* <input
                    type="text"
                    value={editingTypeName}
                    onChange={(e) => setEditingTypeName(e.target.value)}
                    placeholder="Enter Editing Type Name"
                    className="w-full sm:flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                  /> */}
                  <input
                    type="text"
                    value={editingTypeName}
                    onChange={(e) => setEditingTypeName(e.target.value)}
                    placeholder="Enter Editing Type Name"
                    className="w-full sm:flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                  />
                  <input
                    type="number"
                    value={editingTypeAmount}
                    onChange={(e) => setEditingTypeAmount(e.target.value)}
                    placeholder="Enter Amount"
                    className="w-full sm:w-40 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                    required
                  />

                  <button
                    onClick={addEditingType}
                    className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
                  >
                    Add Editing Type
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminAddServices;
