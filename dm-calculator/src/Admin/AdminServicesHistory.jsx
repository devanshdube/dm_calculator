import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Search, Filter } from "lucide-react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

const AdminServicesHistory = () => {
  const baseURL = "http://localhost:5555";
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const clientPerPage = 7;
  const [serviceData, setServiceData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/api/services/details/all`
      );
      if (res.data.status === "Success") {
        console.log(res.data.data);
        setServiceData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(serviceData);

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Services History</h2>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDelete(item)}
                            className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
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
//   const history = [
//     {
//       id: 1,
//       date: "2024-06-05",
//       client: "Acme Corporation",
//       action: "Service Delivered",
//       service: "Web Development",
//       status: "Completed",
//       amount: "$15,000",
//     },
//     {
//       id: 2,
//       date: "2024-06-04",
//       client: "TechStart Inc",
//       action: "Proposal Sent",
//       service: "Mobile App Development",
//       status: "Pending",
//       amount: "$25,000",
//     },
//     {
//       id: 3,
//       date: "2024-06-03",
//       client: "Global Solutions",
//       action: "Contract Signed",
//       service: "Digital Marketing",
//       status: "Active",
//       amount: "$8,000",
//     },
//     {
//       id: 4,
//       date: "2024-06-02",
//       client: "Acme Corporation",
//       action: "Meeting Scheduled",
//       service: "Brand Identity Design",
//       status: "Scheduled",
//       amount: "$12,000",
//     },
//     {
//       id: 5,
//       date: "2024-06-01",
//       client: "TechStart Inc",
//       action: "Initial Contact",
//       service: "E-commerce Solution",
//       status: "Follow-up",
//       amount: "$30,000",
//     },
//   ];

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "active":
//         return "bg-green-100 text-green-800";
//       case "prospect":
//         return "bg-blue-100 text-blue-800";
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "scheduled":
//         return "bg-purple-100 text-purple-800";
//       case "follow-up":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };
