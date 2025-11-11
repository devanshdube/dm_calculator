import React, { useEffect, useState } from "react";
import { Calendar, Search, ArrowLeft, Trash, ChevronDown, EyeClosed, EyeIcon, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import Swal from "sweetalert2";

const InvoiceHistory = () => {
  const baseURL = `https://dmcalculator.dentalguru.software`;
  const navigate = useNavigate();
const [openDropdown, setOpenDropdown] = useState(null); // track which row is open
  const [fetchServices, setFetchServices] = useState([]);
  // const [clientData, setClientData] = useState([]);
  const { id } = useParams();
  const { currentUser, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const clientPerPage = 5;
  console.log(id);
  console.log(currentUser);
  const [filterType, setFilterType] = useState("All");


  const fetchAllClientServices = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getAllInvoice`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "Success") {
    
        setFetchServices(res.data.data.reverse());
        console.log(fetchServices);
        
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          dispatch(clearUser());
          localStorage.removeItem("token");
          navigate("/");
        });
      }
    }
  };

  console.log(fetchServices);

  useEffect(() => {
    fetchAllClientServices();
  }, []);

  const filteredItems = fetchServices.filter((row) => {
  // ✅ Bill type filter
  if (filterType !== "All" && row.bill_type !== filterType) {
    return false;
  }

  // ✅ Keyword search filter
  if (!keyword.trim()) return true;

  const searchTerm = keyword.trim().toLowerCase();
  return (
    (row?.txn_id && row.txn_id.toLowerCase().includes(searchTerm)) ||
    (row?.client_name && row.client_name.toLowerCase().includes(searchTerm)) ||
    (row?.client_organization && row.client_organization.toLowerCase().includes(searchTerm))
  );
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
    const handleDeleteInvoice = async (txnId,id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this invoice permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await axios.delete(
        `${baseURL}/auth/api/calculator/deleteAllInvoiceServiceHistory/${id}/${txnId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "Success") {
          setFetchServices((prev) => prev.filter((item) => item.txn_id !== txnId));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Invoice deleted successfully.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: response.data.message || "Unable to delete invoice.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while deleting invoice.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };
  // ✅ Copy Invoice Function
const handleCopyInvoice = async (txnId) => {
  try {
    const confirm = await Swal.fire({
      title: "Copy Invoice?",
      text: "Do you want to create a copy of this invoice?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, copy it!",
    });

    if (!confirm.isConfirmed) return;

    const response = await axios.post(
      `${baseURL}/auth/api/calculator/copyInvoiceByTxnId/${txnId}`,
      {}, // no body needed
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === "Success") {
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Invoice copied successfully.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // ✅ Refresh list after copying
      fetchAllClientServices();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: response.data.message || "Unable to copy invoice.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error("Error copying invoice:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while copying invoice.",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};
const handleNavigateInovice = (selectedTxn,selectedClient,billType) =>{
    const isGST = billType === "GST";
     navigate(
                      `/admin/invoice/${selectedClient}/${selectedTxn}?gst=${isGST ? 1 : 0}`
                    );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Invoice History
            </h2>
            {/* <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button> */}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* <div className="relative group">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-purple-400 transition-colors" />
              <select className="w-full sm:w-auto pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm hover:bg-gray-700/50 transition-all text-sm">
                <option>All Activities</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Active</option>
              </select>
            </div> */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  {/* Bill Type Filter */}
  <div className="relative group">
    <select
      value={filterType}
      onChange={(e) => {
        setFilterType(e.target.value);
        setCurrentPage(0);
      }}
      className="w-full sm:w-auto px-4 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm hover:bg-gray-700/50 transition-all text-sm"
    >
      <option value="All">All</option>
      <option value="GST">GST</option>
      <option value="NON_GST">Non-GST</option>
    </select>
  </div>

  {/* Search Box */}
  <div className="relative group">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-cyan-400 transition-colors" />
    <input
      type="text"
      value={keyword}
      placeholder="Search history..."
      className="w-full sm:w-auto pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm hover:bg-gray-700/50 transition-all text-sm"
      onChange={(e) => {
        setKeyword(e.target.value);
        setCurrentPage(0);
      }}
    />
  </div>
</div>

          </div>
        </div>

        {/* Main Table */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="overflow-x-auto h-[40rem]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                      INDEX
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                      Client
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                      TXN ID
                    </th>
                    <th className="text-left py-4  font-semibold text-gray-200 uppercase tracking-wider text-sm">
  Bill Number
</th>

                    {/* <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                      Service
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                      Status
                    </th> */}
                    <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                      Action
                    </th>
                   <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
                    Amount Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showApiData.length > 0 ? (
                    showApiData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="py-5 px-6">
                          <div className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3 text-gray-300 group-hover:text-white transition-colors">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span className="font-medium">
                              {moment(item.created_at).format("DD MMMM YYYY")}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
                            {item.client_name}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="font-bold text-xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            {item.txn_id ? item.txn_id : "N/A"}
                          </div>
                        </td>
                 <td className="py-5 ">
  <div
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
      item.bill_type === "GST"
        ? `bg-green-500/20 text-green-400`
        : "bg-gray-500/20 text-gray-300"
    }`}
  >
     {item.bill_type === "GST" ? `GST-${item.bill_number}` : `N-GST-${item.bill_number}`}
  </div>
</td>

       

        {/* Actions Dropdown */}
        <td className="py-5 px-6 relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === index ? null : index)
            }
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
          >
            Actions <ChevronDown size={16} className="ml-2" />
          </button>

          {openDropdown === index && (
            <div className="absolute mt-2 right-0 w-40 bg-white rounded-lg shadow-lg border z-50">
              <ul className="text-sm text-gray-700">
                <li>
                  <button
                    onClick={() => {
                       handleNavigateInovice(item.txn_id,item.client_id,item.bill_type)
                
                      setShowModal(true);
                      setOpenDropdown(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <EyeIcon size={14} className="inline mr-2" />   Preview
                  </button>
                </li>
               
                <li>
                  <button
                    onClick={() => {
                      handleCopyInvoice(item.txn_id);
                      setOpenDropdown(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                  >
                      <Copy size={14} className="inline mr-2" /> New
                  </button>
                </li>
                  {item.tag_received_amt === "received" ? (
                    null
                  ): (
                 <li>
                  <button
                    onClick={() => {
                      handleDeleteInvoice(item.txn_id, item.client_id);
                      setOpenDropdown(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    <Trash size={14} className="inline mr-2" /> Delete
                  </button>
                </li>
                  )
                
                }
              </ul>
            </div>
          )}
        </td>
         <td className="py-5 px-6">
                         {item.tag_received_amt === "received" ? (
                         <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-lg shadow-orange-500/25">
                            {item.tag_received_amt}
                          </div>):(
                          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-500 to-red-500 text-white shadow-lg shadow-red-500/25">
                            {item.tag_received_amt}
                          </div>
                          )
}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-10 text-center text-gray-400"
                      >
                        No service history found for this client.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
  );
};

export default InvoiceHistory;
const PaginationContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 10px;
    list-style: none;
    border-radius: 5px;
    margin-bottom: 1.5rem;
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
