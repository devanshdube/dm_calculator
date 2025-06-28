import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Mail, Lock, User } from "lucide-react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { clearUser } from "../redux/user/userSlice";

export default function RegisterBD() {
  const baseURL = `https://dm.calculator.one-realty.in`;
  const { token } = useSelector((state) => state.user);
  //   const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_email: "",
    employee_password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseURL}/auth/api/calculator/registerBD`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Registered",
        text: response.data.message,
      });

      setFormData({
        employee_name: "",
        employee_email: "",
        employee_password: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const token = localStorage.getItem("token");

  //   try {
  //     const response = await axios.post(
  //       `${baseURL}/auth/api/calculator/registerBD`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     Swal.fire({
  //       icon: "success",
  //       title: "Registered",
  //       text: response.data.message,
  //     });

  //     setFormData({
  //       employee_name: "",
  //       employee_email: "",
  //       employee_password: "",
  //     });
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       // Token expired or invalid
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Session Expired",
  //         text: "Please login again.",
  //         confirmButtonText: "Go to Login",
  //       }).then(() => {
  //         localStorage.removeItem("token");
  //         navigate("/"); // Replace with your login route
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text:
  //           error.response?.data?.message || "Something went wrong. Try again.",
  //       });
  //     }
  //   }
  // };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-200">
          Register BD
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee Name */}
          <div>
            <label className="block text-sm font-medium text-gray-50 mb-1">
              Employee Name
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="employee_name"
                value={formData.employee_name}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-50 mb-1">
              Email
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                name="employee_email"
                value={formData.employee_email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-50 mb-1">
              Password
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="password"
                name="employee_password"
                value={formData.employee_password}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
