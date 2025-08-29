// import React, { useEffect, useState } from "react";
// import { Calendar, Search, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import moment from "moment";
// import ReactPaginate from "react-paginate";
// import styled from "styled-components";
// import { useDispatch, useSelector } from "react-redux";
// import { clearUser } from "../redux/user/userSlice";
// import Swal from "sweetalert2";
// import ServiceProgressTable from "./ServiceProgressTable";

// const AssignQuotation = () => {
//   const baseURL = `http://localhost:5555`;
//   const navigate = useNavigate();
//   const [fetchServices, setFetchServices] = useState([]);
//   // const [clientData, setClientData] = useState([]);
//   const { id } = useParams();
//   const { currentUser, token } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const [keyword, setKeyword] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const clientPerPage = 5;
//   console.log(id);
//   console.log(currentUser);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [selectedTxn, setSelectedTxn] = useState(null);
//   const [userID, setUserID] = useState(null);

//   const fetchAllClientServices = async () => {
//     try {
//       const res = await axios.get(
//         `${baseURL}/auth/api/calculator/getAssignedQuotations`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.status === "Success") {
//         setFetchServices(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//       if (error.response && error.response.status === 401) {
//         Swal.fire({
//           title: "Session Expired",
//           text: "Please login again.",
//           icon: "warning",
//           confirmButtonText: "OK",
//         }).then(() => {
//           dispatch(clearUser());
//           localStorage.removeItem("token");
//           navigate("/");
//         });
//       }
//     }
//   };

//   console.log(fetchServices);

//   useEffect(() => {
//     fetchAllClientServices();
//   }, []);

//   const filteredItems = fetchServices.filter((row) => {
//     if (!keyword.trim()) return true;

//     const searchTerm = keyword.trim().toLowerCase();
//     return (
//       (row?.txn_id && row.txn_id.toLowerCase().includes(searchTerm)) ||
//       (row?.client_name && row.client_name.toLowerCase().includes(searchTerm))
//     );
//   });

//   console.log("Filtered:", filteredItems.length, filteredItems);

//   const totalPages = Math.ceil(filteredItems.length / clientPerPage);

//   const filterPagination = () => {
//     const startIndex = currentPage * clientPerPage;
//     const endIndex = startIndex + clientPerPage;
//     return filteredItems?.slice(startIndex, endIndex);
//   };

//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const showApiData = filterPagination();

//   const handleOpenProgress = (row) => {
//     const cid = row?.client_id ?? null;
//     const txn = row?.txn_id ?? null;
//     const uid = row?.user_id ?? null;

//     if (!cid || !txn) {
//       Swal.fire({
//         icon: "warning",
//         title: "Missing Information",
//         text: !cid
//           ? "Client ID not found for this row."
//           : "Transaction ID not found for this row.",
//       });
//       return;
//     }

//     setSelectedClient(cid);
//     setSelectedTxn(txn);
//     setUserID(uid);
//     setShowModal(true);
//   };

//   useEffect(() => {
//     if (showModal) {
//       const prev = document.body.style.overflow;
//       document.body.style.overflow = "hidden";
//       return () => (document.body.style.overflow = prev);
//     }
//   }, [showModal]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       <div className="relative z-10 p-6 space-y-8">
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0">
//           <div>
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//               Assign Quotation List
//             </h2>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-cyan-400 transition-colors" />
//               <input
//                 type="text"
//                 value={keyword}
//                 placeholder="Search history..."
//                 className="w-full sm:w-auto pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm hover:bg-gray-700/50 transition-all text-sm"
//                 onChange={(e) => {
//                   setKeyword(e.target.value);
//                   setCurrentPage(0);
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
//           <div className="p-8">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-700/50">
//                     <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
//                       SNo.
//                     </th>
//                     <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
//                       Date
//                     </th>
//                     <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
//                       Client
//                     </th>
//                     <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
//                       TXN ID
//                     </th>
//                     <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
//                       User Name
//                     </th>
//                     <th className="text-left py-4 px-6 font-semibold text-gray-200 uppercase tracking-wider text-sm">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {showApiData.length > 0 ? (
//                     showApiData.map((item, index) => (
//                       <tr
//                         key={item.id}
//                         className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 group"
//                         style={{ animationDelay: `${index * 100}ms` }}
//                       >
//                         <td className="py-5 px-6">
//                           <div className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
//                             {index + 1}
//                           </div>
//                         </td>
//                         <td className="py-5 px-6">
//                           <div className="flex items-center gap-3 text-gray-300 group-hover:text-white transition-colors">
//                             <Calendar className="w-4 h-4 text-purple-400" />
//                             <span className="font-medium">
//                               {moment(item.txn_date).format("DD MMMM YYYY")}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="py-5 px-6">
//                           <div className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
//                             {item.client_name}
//                           </div>
//                         </td>
//                         <td className="py-5 px-6">
//                           <div className="font-bold text-xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
//                             {item.txn_id ? item.txn_id : "N/A"}
//                           </div>
//                         </td>
//                         <td className="py-5 px-6">
//                           <div className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
//                             {item.employee_name}
//                           </div>
//                         </td>
//                         <td className="py-5 px-6">
//                           <button
//                             onClick={() => handleOpenProgress(item)}
//                             className="inline-block px-4 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
//                           >
//                             View / Update Progress
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="5"
//                         className="py-10 text-center text-gray-400"
//                       >
//                         No service history found for this client.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//             <div className="relative bg-white w-[95%] max-w-6xl rounded-2xl shadow-xl p-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 ×
//               </button>

//               <div className="mb-3">
//                 <h3 className="text-xl font-semibold">
//                   Progress — TXN:{" "}
//                   <span className="text-emerald-600">{selectedTxn}</span>
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Client ID: {selectedClient}
//                 </p>
//               </div>

//               <ServiceProgressTable
//                 baseURL={baseURL}
//                 token={token}
//                 clientId={selectedClient}
//                 txnId={selectedTxn}
//                 currentEmployeeId={userID}
//               />
//             </div>
//           </div>
//         )} */}

//         {showModal && (
//           <div
//             className="fixed inset-0 z-50 grid place-items-center bg-black/50
//                motion-safe:transition-opacity motion-safe:duration-200"
//           >
//             <div
//               className="relative bg-white w-[95%] max-w-6xl rounded-2xl shadow-xl
//                  p-4 max-h-[85vh] overflow-y-auto transform-gpu
//                  motion-safe:transition-all motion-safe:duration-200
//                  will-change-transform"
//             >
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 ×
//               </button>

//               <div className="mb-3">
//                 <h3 className="text-xl font-semibold">
//                   Progress — TXN:{" "}
//                   <span className="text-emerald-600">{selectedTxn}</span>
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Client ID: {selectedClient}
//                 </p>
//               </div>

//               <ServiceProgressTable
//                 baseURL={baseURL}
//                 token={token}
//                 clientId={selectedClient}
//                 txnId={selectedTxn}
//                 currentEmployeeId={userID}
//               />
//             </div>
//           </div>
//         )}

//         <PaginationContainer>
//           <ReactPaginate
//             previousLabel={"Previous"}
//             nextLabel={"Next"}
//             breakLabel={"..."}
//             pageCount={totalPages}
//             marginPagesDisplayed={2}
//             pageRangeDisplayed={5}
//             onPageChange={handlePageChange}
//             containerClassName={"pagination"}
//             activeClassName={"active"}
//             forcePage={currentPage}
//           />
//         </PaginationContainer>
//       </div>
//     </div>
//   );
// };

// export default AssignQuotation;
// const PaginationContainer = styled.div`
//   .pagination {
//     display: flex;
//     justify-content: center;
//     padding: 10px;
//     list-style: none;
//     border-radius: 5px;
//     margin-bottom: 1.5rem;
//   }

//   .pagination li {
//     margin: 0 5px;
//   }

//   .pagination li a {
//     display: block;
//     padding: 8px 16px;
//     border: 1px solid #e6ecf1;
//     color: #a73418;
//     cursor: pointer;
//     text-decoration: none;
//     border-radius: 5px;
//     box-shadow: 0px 0px 1px #000;
//     font-size: 14px; /* Default font size */
//   }

//   .pagination li.active a {
//     background-color: #fef9c3;
//     color: #d7a548;
//     border: 1px solid #fef9c3;
//   }

//   .pagination li.disabled a {
//     color: #166556;
//     cursor: not-allowed;
//     background-color: #dcfce7;
//     border: 1px solid #dcfce7;
//   }

//   .pagination li a:hover:not(.active) {
//     background-color: #dcfce7;
//     color: #166556;
//   }

//   /* Responsive adjustments for smaller screens */
//   @media (max-width: 768px) {
//     .pagination {
//       padding: 5px;
//       flex-wrap: wrap;
//     }

//     .pagination li {
//       margin: 2px;
//     }

//     .pagination li a {
//       padding: 6px 10px;
//       font-size: 12px;
//     }
//   }

//   @media (max-width: 480px) {
//     .pagination {
//       padding: 5px;
//     }

//     .pagination li {
//       margin: 2px;
//     }

//     .pagination li a {
//       padding: 4px 8px;
//       font-size: 10px;
//     }

//     /* Hide the previous and next labels for extra-small screens */
//     .pagination li:first-child a::before {
//       content: "«";
//       margin-right: 5px;
//     }

//     .pagination li:last-child a::after {
//       content: "»";
//       margin-left: 5px;
//     }
//   }
// `;

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import Swal from "sweetalert2";
import ServiceProgressTable from "./ServiceProgressTable";

const PAGE_SIZE = 4;

const AssignQuotation = () => {
  // const baseURL = `http://localhost:5555`;
  const baseURL = `https://dmcalculator.dentalguru.software`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((s) => s.user);

  const [rows, setRows] = useState([]);
  const [keyword, setKeyword] = useState("");

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [userID, setUserID] = useState(null);

  // separate pagination for single vs team
  const [singlePage, setSinglePage] = useState(0);
  const [teamPage, setTeamPage] = useState(0);

  const fetchAllClientServices = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getAssignedQuotations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data?.status === "Success") {
        setRows(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401) {
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

  console.log(rows);

  useEffect(() => {
    fetchAllClientServices();
  }, []);

  // --- Group helpers ---
  const norm = (s) => String(s || "").toLowerCase();
  const groupKey = (r) =>
    r.assign_group_id || `${r.team_id || "NA"}|${r.txn_id}`;

  // filter by keyword (applies to both lists)
  const filtered = useMemo(() => {
    if (!keyword.trim()) return rows;
    const q = norm(keyword);
    return rows.filter((r) => {
      return (
        norm(r.txn_id).includes(q) ||
        norm(r.client_name).includes(q) ||
        norm(r.employee_name).includes(q) ||
        norm(r.team_name).includes(q)
      );
    });
  }, [rows, keyword]);

  // split lists
  const singles = useMemo(
    () => filtered.filter((r) => r.assignment_mode === "single"),
    [filtered]
  );

  const teamGroups = useMemo(() => {
    const map = new Map();
    filtered
      .filter((r) => r.assignment_mode === "team")
      .forEach((r) => {
        const key = groupKey(r);
        if (!map.has(key)) {
          map.set(key, {
            key,
            txn_id: r.txn_id,
            client_id: r.client_id,
            client_name: r.client_name,
            txn_date: r.txn_date,
            team_id: r.team_id,
            team_name: r.team_name, // backend se aaye to acha; otherwise fallback below
            members: [],
          });
        }
        map.get(key).members.push({
          user_id: r.user_id,
          employee_name: r.employee_name,
        });
      });

    // beautify output
    return Array.from(map.values()).map((g) => ({
      ...g,
      team_label: g.team_name || (g.team_id ? `Team #${g.team_id}` : "Team"),
      members_count: g.members.length,
      member_names: g.members.map((m) => m.employee_name).join(", "),
    }));
  }, [filtered]);

  // paginate
  const singleTotalPages = Math.ceil(singles.length / PAGE_SIZE) || 1;
  const teamTotalPages = Math.ceil(teamGroups.length / PAGE_SIZE) || 1;

  const singlePageRows = useMemo(() => {
    const start = singlePage * PAGE_SIZE;
    return singles.slice(start, start + PAGE_SIZE);
  }, [singles, singlePage]);

  const teamPageRows = useMemo(() => {
    const start = teamPage * PAGE_SIZE;
    return teamGroups.slice(start, start + PAGE_SIZE);
  }, [teamGroups, teamPage]);

  // reset pages on search
  useEffect(() => {
    setSinglePage(0);
    setTeamPage(0);
  }, [keyword]);

  // open modal
  const handleOpenProgressSingle = (row) => {
    const cid = row?.client_id;
    const txn = row?.txn_id;
    const uid = row?.user_id || null;
    if (!cid || !txn) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Client or TXN missing in this row.",
      });
      return;
    }
    setSelectedClient(cid);
    setSelectedTxn(txn);
    setUserID(uid); // single user id
    setShowModal(true);
  };

  const handleOpenProgressTeam = (group) => {
    const cid = group?.client_id;
    const txn = group?.txn_id;
    if (!cid || !txn) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Client or TXN missing in this row.",
      });
      return;
    }
    setSelectedClient(cid);
    setSelectedTxn(txn);
    setUserID(null); // TEAM: pass null so table can show all members
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [showModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* bg blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Assign Quotation List
          </h2>
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={keyword}
              placeholder="Search by txn / client / member / team"
              className="w-full sm:w-80 pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm hover:bg-gray-700/50 transition-all text-sm"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* ================= SINGLE ASSIGNMENTS ================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white/90">
              Single Assignments
            </h3>
            <div className="text-xs text-gray-400">
              {singles.length
                ? `${singles.length} rows`
                : "No single assignments"}
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        SNo.
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        TXN ID
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        User Name
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {singlePageRows.length ? (
                      singlePageRows.map((item, idx) => (
                        <tr
                          key={`${item.id}-${idx}`}
                          className="border-b border-gray-700/30 hover:bg-gray-700/20"
                        >
                          <td className="py-4 px-4 text-white/90">
                            {singlePage * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span className="font-medium">
                                {item.txn_date
                                  ? moment(item.txn_date).format("DD MMM YYYY")
                                  : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white">
                            {item.client_name}
                          </td>
                          <td className="py-4 px-4 font-semibold text-emerald-300">
                            {item.txn_id || "N/A"}
                          </td>
                          <td className="py-4 px-4 text-white">
                            {item.employee_name}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleOpenProgressSingle(item)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            >
                              View / Update Progress
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-gray-400"
                        >
                          No single assignments found.
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
              pageCount={singleTotalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => setSinglePage(selected)}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={singlePage}
            />
          </PaginationContainer>
        </section>

        {/* ================= TEAM ASSIGNMENTS ================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white/90">
              Team Assignments
            </h3>
            <div className="text-xs text-gray-400">
              {teamGroups.length
                ? `${teamGroups.length} rows`
                : "No team assignments"}
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        SNo.
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        TXN ID
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Team
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Members
                      </th>
                      <th className="text-left py-3 px-4 text-gray-200 uppercase tracking-wider text-xs">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPageRows.length ? (
                      teamPageRows.map((g, idx) => (
                        <tr
                          key={g.key}
                          className="border-b border-gray-700/30 hover:bg-gray-700/20"
                        >
                          <td className="py-4 px-4 text-white/90">
                            {teamPage * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span className="font-medium">
                                {g.txn_date
                                  ? moment(g.txn_date).format("DD MMM YYYY")
                                  : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white">
                            {g.client_name}
                          </td>
                          <td className="py-4 px-4 font-semibold text-emerald-300">
                            {g.txn_id}
                          </td>
                          <td className="py-4 px-4 text-white">
                            {g.team_label}
                          </td>
                          <td className="py-4 px-4 text-gray-200">
                            {g.members_count}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleOpenProgressTeam(g)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
                              title={g.member_names}
                            >
                              View / Update Progress
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-gray-400"
                        >
                          No team assignments found.
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
              pageCount={teamTotalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => setTeamPage(selected)}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={teamPage}
            />
          </PaginationContainer>
        </section>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
            <div className="relative bg-white w-[95%] max-w-6xl rounded-2xl shadow-xl p-4 max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>

              <div className="mb-3">
                <h3 className="text-xl font-semibold">
                  Progress — TXN:{" "}
                  <span className="text-emerald-600">{selectedTxn}</span>
                </h3>
                <p className="text-sm text-gray-500">
                  Client ID: {selectedClient}
                </p>
              </div>

              <ServiceProgressTable
                baseURL={baseURL}
                token={token}
                clientId={selectedClient}
                txnId={selectedTxn}
                currentEmployeeId={userID /* team => null, single => number */}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignQuotation;

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
    font-size: 14px;
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
