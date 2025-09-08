import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Search,
  Filter,
  PenTool,
  Edit,
  Mail,
  User,
  X,
  IndianRupee,
} from "lucide-react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { clearUser } from "../redux/user/userSlice";

const AdminServicesHistory = () => {
  const baseURL = "https://dmcalculator.dentalguru.software";
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const clientPerPage = 7;
  const [serviceData, setServiceData] = useState([]);
  const { currentUser, token } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    editing_type_id: "",
    editing_type_name: "",
    amount: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(currentUser);
  console.log(token);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/api/services/details/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        console.log(res.data.data);
        setServiceData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  useEffect(() => {
    fetchData();
  }, []);

  console.log(serviceData);

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      editing_type_id: "",
      editing_type_name: "",
      amount: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting form data:", formData);
      let response;

      response = await axios.put(
        `${baseURL}/auth/api/calculator/updateServiceData/${formData.editing_type_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API response:", response.data);

      if (response.data.status === "Success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Service Editing Type updated successfully!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          setShowModal(false);
          fetchData();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.data.message ||
            "Failed to editing type. Please try again.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error saving client:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Status:", error.response.status);
        Swal.fire({
          icon: "error",
          title: `Error ${error.response.status}`,
          text:
            error.response.data.message ||
            "Failed to update service editing type. Please try again.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update service editing type. Please try again.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      if (row.editing_type_id) {
        // Delete Editing Type
        await axios.delete(
          `${baseURL}/auth/api/calculator/deleteEditingType/${row.editing_type_id}`
        );
      } else if (row.category_id) {
        // Try deleting category
        const res = await axios.delete(
          `${baseURL}/auth/api/calculator/deleteCategory/${row.category_id}`
        );
        if (res.data.status !== "Success") {
          alert(res.data.message || "Cannot delete category");
        }
      } else if (row.service_id) {
        // Try deleting service
        const res = await axios.delete(
          `${baseURL}/auth/api/calculator/deleteService/${row.service_id}`
        );
        if (res.data.status !== "Success") {
          alert(res.data.message || "Cannot delete service");
        }
      }

      fetchData(); // Refresh
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  const filteredItems = serviceData.filter((row) => {
    const matchesKeyword =
      (row?.service_name &&
        row.service_name
          .toLowerCase()
          .includes(keyword.trim().toLowerCase())) ||
      (row?.category_name &&
        row.category_name
          .toLowerCase()
          .includes(keyword.trim().toLowerCase())) ||
      (row?.editing_type_name &&
        row.editing_type_name
          .toLowerCase()
          .includes(keyword.trim().toLowerCase()));

    return matchesKeyword;
  });

  const totalPages = Math.ceil(filteredItems.length / clientPerPage);

  const filterPagination = () => {
    const startIndex = currentPage * clientPerPage;
    const endIndex = startIndex + clientPerPage;
    return filteredItems?.slice(startIndex, endIndex);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const showApiData = filterPagination();
  return (
    <>
      <div className="space-y-8 mb-8">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-gray-300">Services History</h2>
          <div className="flex gap-3">
            {/* <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Activities</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Active</option>
              </select>
            </div> */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                value={keyword}
                placeholder="Search history..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Services
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Categories
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Editing Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showApiData && showApiData.length > 0 ? (
                    showApiData?.map((item) => (
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {item.service_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-700">
                            {item.category_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-700">
                            {item.editing_type_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-700">{item.amount}</div>
                        </td>
                        {/* <td className="py-4 px-4">
                          <button className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            Update
                          </button>
                        </td> */}
                        <td className="py-4 px-4 ">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent card onClick

                              setFormData({
                                editing_type_id: item.editing_type_id,
                                editing_type_name: item.editing_type_name,
                                amount: item.amount,
                              });

                              setShowModal(true);
                            }}
                            className="inline-block px-3 py-2 mx-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="inline-block px-3 py-2 mt-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-6">
                      <p>No Services Found</p>
                    </div>
                  )}
                </tbody>
              </table>
            </div>
            <PaginationContainer>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
                forcePage={currentPage}
              />
            </PaginationContainer>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl transform transition-all animate-in fade-in-0 zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {"Edit Service"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Client Name */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Edit className="w-4 h-4 inline mr-2" />
                    Editing Type
                  </label>
                  <input
                    type="text"
                    name="editing_type_name"
                    value={formData.editing_type_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                {/* amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IndianRupee className="w-4 h-4 inline mr-2" />
                    Amount
                  </label>
                  <input
                    type="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter amount "
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    {loading ? "Saving..." : "Save Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminServicesHistory;
const PaginationContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px;
    list-style: none;
    border-radius: 5px;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    display: block;
    padding: 8px 16px;
    border: 1px solid #e6ecf1;
    color: #a73418;
    cursor: pointer;
    text-decoration: none;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #000;
    font-size: 14px; /* Default font size */
  }

  .pagination li.active a {
    background-color: #fef9c3;
    color: #d7a548;
    border: 1px solid #fef9c3;
  }

  .pagination li.disabled a {
    color: #166556;
    cursor: not-allowed;
    background-color: #dcfce7;
    border: 1px solid #dcfce7;
  }

  .pagination li a:hover:not(.active) {
    background-color: #dcfce7;
    color: #166556;
  }

  /* Responsive adjustments for smaller screens */
  @media (max-width: 768px) {
    .pagination {
      padding: 5px;
      flex-wrap: wrap;
    }

    .pagination li {
      margin: 2px;
    }

    .pagination li a {
      padding: 6px 10px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .pagination {
      padding: 5px;
    }

    .pagination li {
      margin: 2px;
    }

    .pagination li a {
      padding: 4px 8px;
      font-size: 10px;
    }

    /* Hide the previous and next labels for extra-small screens */
    .pagination li:first-child a::before {
      content: "«";
      margin-right: 5px;
    }

    .pagination li:last-child a::after {
      content: "»";
      margin-left: 5px;
    }
  }
`;
