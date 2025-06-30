import React, { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Search,
  X,
  Building,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import AdminCalculator from "./AdminCalculator";
import { clearUser } from "../redux/user/userSlice";

const AdminClientDetails = () => {
  const baseURL = `http://localhost:5555`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state) => state.user);
  const employeeName = currentUser?.name;
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_organization: "",
    email: "",
    phone: "",
    address: "",
    dg_employee: employeeName,
  });
  console.log(selectedClient);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [getClients, setGetClients] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const clientPerPage = 3;

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      client_name: "",
      client_organization: "",
      email: "",
      phone: "",
      address: "",
      dg_employee: employeeName,
    });
  };

  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/auth/api/calculator/insertClientDetails`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "Success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Client added successfully!",
        }).then(() => {
          setFormData({
            client_name: "",
            client_organization: "",
            email: "",
            phone: "",
            address: "",
            dg_employee: employeeName,
          });
          setShowModal(false);
          getAllClients();
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding client:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add client. Please try again.",
      });
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
    handleClose();
  };

  // All BD client data

  const getAllClients = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/auth/api/calculator/getClientDetails`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch clients. Please try again.",
      });
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
    getAllClients();
  }, []);

  // console.log("getClients:", getClients);

  const filteredItems = getClients.filter((row) => {
    const matchesKeyword =
      (row?.client_name &&
        row.client_name.toLowerCase().includes(keyword.trim().toLowerCase())) ||
      (row?.dg_employee &&
        row.dg_employee.toLowerCase().includes(keyword.trim().toLowerCase())) ||
      (row?.client_organization &&
        row.client_organization
          .toLowerCase()
          .includes(keyword.trim().toLowerCase())) ||
      (row?.phone &&
        row.phone.toLowerCase().includes(keyword.trim().toLowerCase()));

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

  const handleCreateProposal = () => {
    const proposalId = Date.now(); // generates unique number based on current time
    navigate(`/admin/ServicesLanding/${selectedClient.id}/${proposalId}`);
  };

  return (
    <>
      {/* <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                value={keyword}
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </div>
            <button
              onClick={handleShow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </div>
        </div> */}
      <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            Client Details
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                value={keyword}
                placeholder="Search clients..."
                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </div>
            <button
              onClick={handleShow}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">All Clients</h3>
                <div className="space-y-4">
                  {showApiData && showApiData.length > 0 ? (
                    showApiData?.map((client) => (
                      <div
                        key={client.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedClient?.id === client.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {client.client_organization}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {client.client_name}
                                </p>
                              </div>
                            </div>
                            {/* <div className="grid grid-cols-2 gap-4 text-sm text-gray-600"> */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 break-words">
                              <div className="flex items-center gap-2 break-words">
                                <Mail className="w-4 h-4" />
                                {client.email}
                              </div>
                              <div className="flex items-center gap-2 break-words">
                                <Phone className="w-4 h-4" />
                                {client.phone}
                              </div>
                              <div className="flex items-center gap-2 break-words">
                                <MapPin className="w-4 h-4" />
                                {client.address}
                              </div>
                              <div className="flex items-center gap-2 break-words">
                                <Calendar className="w-4 h-4" />
                                Employee : {client.dg_employee}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-6">
                      <p>No clients found</p>
                    </div>
                  )}
                </div>
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

          <div className="lg:col-span-1">
            {selectedClient ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Client Profile</h3>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900">
                      {selectedClient.client_organization}
                    </h4>
                    <p className="text-gray-600">
                      {selectedClient.client_name}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{selectedClient.address}</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={handleCreateProposal}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Proposal
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/client/service/history/${selectedClient.id}`
                        )
                      }
                      className="w-full px-4 py-2 bg-white text-blue-600 dark:text-sky-400 rounded-lg hover:bg-sky-300 transition-colors border-2 border-dashed border-sky-300 hover:text-white"
                    >
                      Proposal History
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a client to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Modal */}
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
                    Add New Client
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
                    <User className="w-4 h-4 inline mr-2" />
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Organization
                  </label>
                  <input
                    type="text"
                    name="client_organization"
                    value={formData.client_organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter phone number"
                    required
                    minLength={10}
                    maxLength={10}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Enter full address"
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
                    {loading ? "Saving..." : "Save Client"}
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

export default AdminClientDetails;
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

{
  /* <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              client.status
                            )}`}
                          >
                            {client.status}
                          </span>
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            {client.value}
                          </p>
                        </div> */
}
{
  /* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedClient.status
                        )}`}
                      >
                        {selectedClient.status}
                      </span>
                    </div> */
}
{
  /* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Total Value:</span>
                      <span className="font-bold text-lg">
                        {selectedClient.value}
                      </span>
                    </div> */
}
