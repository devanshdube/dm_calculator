import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import Swal from "sweetalert2";
import img from "../assets/dg.jpg";

export default function Quotation() {
  const baseURL = `http://localhost:5555`;
  const { id, txn_id } = useParams();
  console.log(id, txn_id);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [serviceData, setServiceData] = useState([]);
  const [graphicData, setGraphicData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getClientServiceHistory/${id}/${txn_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.data);
      setServiceData(res.data.data);
    } catch (error) {
      console.error(error);
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

  console.log(serviceData);

  const fetchClient = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getClientDetailsById/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        console.log(res.data.data);
        setClientData(res.data.data);
      }
    } catch (error) {
      console.log(error);
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

  console.log(clientData);
  const clientName = clientData?.client_name;
  const clientAddress = clientData?.address;
  const clientPhone = clientData?.phone;

  useEffect(() => {
    fetchServices();
    fetchClient();
  }, [id, txn_id]);

  useEffect(() => {
    if (serviceData.length === 0) return;

    const graphicRaw = serviceData.filter(
      (item) => item.service_type === "Graphic Service"
    );
    const adsRaw = serviceData.filter(
      (item) => item.service_type === "Ads Campaign"
    );

    const groupedGraphic = [];

    graphicRaw.forEach((item) => {
      let service = groupedGraphic.find((s) => s.service === item.service_name);
      if (!service) {
        service = { service: item.service_name, categories: [] };
        groupedGraphic.push(service);
      }

      let category = service.categories.find(
        (c) => c.categoryName === item.category_name
      );
      if (!category) {
        category = { categoryName: item.category_name, editingTypes: [] };
        service.categories.push(category);
      }

      category.editingTypes.push({
        type: item.editing_type_name || "N/A",
        quantity: Number(item.quantity) || 1,
        price: Number(item.editing_type_amount) || 0,
        total: Number(item.total_amount) || 0,
      });
    });

    setGraphicData(groupedGraphic);
    setAdsData(adsRaw);
    setLoading(false);
  }, [serviceData]);

  const graphicTotal = graphicData.reduce((serviceSum, service) => {
    return (
      serviceSum +
      service.categories.reduce((catSum, cat) => {
        return (
          catSum +
          cat.editingTypes.reduce((editSum, edit) => {
            return editSum + (edit.total || edit.price * edit.quantity);
          }, 0)
        );
      }, 0)
    );
  }, 0);

  const adsTotal = adsData.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0
  );

  const grandTotal = graphicTotal + adsTotal;

  if (loading)
    return (
      <div className="text-center p-10 font-semibold text-gray-700">
        Loading...
      </div>
    );

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 print:block print:p-0 print:bg-white">
        <div className="bg-white p-4 sm:p-6 md:p-8 shadow-lg rounded-lg max-w-6xl w-full print:shadow-none print:p-4 print:rounded-none">
          {/* BUTTONS */}
          <div className="print:hidden flex flex-wrap justify-center md:justify-end gap-3 mb-6">
            <button
              onClick={() => window.print()}
              className="inline-flex min-w-[100px] justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-full shadow-sm transition"
            >
              🖨️ <span>Print</span>
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex min-w-[100px] justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-full shadow-sm transition"
            >
              📊 <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex min-w-[100px] justify-center items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-full shadow-sm transition"
            >
              🔙 <span>Back</span>
            </button>
          </div>

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 print:flex-row print:gap-10">
            <div className="md:w-1/2 print:w-1/2">
              <h3 className="text-lg font-semibold mb-4">Client Details</h3>
              <p>
                <strong>Name:</strong> {clientName}
              </p>
              <p>
                <strong>Contact:</strong> {clientPhone}
              </p>
              <p>
                <strong>Address:</strong> {clientAddress}
              </p>
            </div>

            <div className="md:w-1/2 text-right print:w-1/2">
              <img
                src={img} // Update the path to where you put the image in your project
                alt="DOAGuru Logo"
                className="w-32 h-auto mb-1 mx-auto md:mx-0" // Adjust width and alignment as you want
              />

              {/* <h1 className="text-3xl font-bold text-indigo-700 mb-1">
                DOAGuru InfoSystems
              </h1> */}

              <p className="text-gray-600">
                1815, Wright Town, Jabalpur,
                <br />
                Madhya Pradesh 482002
              </p>
              <p className="text-gray-600 mb-4">Phone: 074409 92424</p>
              <h2 className="text-xl font-semibold">Quotation</h2>
              <p className="text-gray-600">{moment().format("DD/MM/YYYY")}</p>
              <p className="text-gray-600">Quote #: {txn_id}</p>
            </div>
          </div>

          {/* GRAPHIC SECTION */}
          <section className="mb-10">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
              Graphic Services
            </h3>
            {graphicData.length === 0 ? (
              <p className="text-center text-gray-500">
                No Graphic Services found.
              </p>
            ) : (
              graphicData.map((service, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="font-semibold text-lg mb-3">
                    {service.service}
                  </h4>
                  {service.categories.map((cat, cidx) => (
                    <div key={cidx} className="mb-4">
                      <h5 className="font-semibold mb-2">{cat.categoryName}</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                                Editing Type
                              </th>
                              <th className="border px-3 py-2 text-right">
                                Quantity
                              </th>
                              <th className="border px-3 py-2 text-right">
                                Price (₹)
                              </th>
                              <th className="border px-3 py-2 text-right">
                                Total (₹)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {cat.editingTypes.map((edit, eidx) => (
                              <tr
                                key={eidx}
                                className={
                                  eidx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="border px-3 py-2">
                                  {edit.type}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                  {edit.quantity}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                  {edit.price.toLocaleString()}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                  {edit.total.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            <p className="font-semibold text-right text-lg mt-4">
              Graphic Total: ₹{graphicTotal.toLocaleString()}
            </p>
          </section>

          {/* ADS SECTION */}
          <section className="mb-10">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
              Ads Services
            </h3>
            {adsData.length === 0 ? (
              <p className="text-center text-gray-500">
                No Ads Services found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Category</th>
                      <th className="border px-3 py-2 text-right">
                        Amount (₹)
                      </th>
                      <th className="border px-3 py-2 text-right">
                        Percentage (%)
                      </th>
                      <th className="border px-3 py-2 text-right">
                        Charges (₹)
                      </th>
                      <th className="border px-3 py-2 text-right">
                        Final Total (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adsData.map((ad, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border px-3 py-2">{ad.category_name}</td>
                        <td className="border px-3 py-2 text-right">
                          {Number(
                            ad.editing_type_amount || ad.amount || 0
                          ).toLocaleString()}
                        </td>
                        <td className="border px-3 py-2 text-right">
                          {ad.percent || ad.percentage || 0}
                        </td>
                        <td className="border px-3 py-2 text-right">
                          {Number(ad.charge || 0).toLocaleString()}
                        </td>
                        <td className="border px-3 py-2 text-right font-semibold">
                          {Number(
                            ad.total_amount || ad.finalTotal || 0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="font-semibold text-right text-lg mt-4">
              Ads Total: ₹{adsTotal.toLocaleString()}
            </p>
          </section>

          {/* GRAND TOTAL */}
          <section className="border-t pt-4 text-right">
            <p className="text-2xl font-bold text-indigo-700">
              Grand Total: ₹{grandTotal.toLocaleString()}
            </p>
          </section>

          {/* FOOTER */}
          <footer className="mt-10 border-t pt-6 text-center text-gray-600 text-sm">
            <p>Thank you for your business!</p>
            <p>Please contact us for any questions regarding this quotation.</p>
          </footer>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
  }
`;

//   return (
//     <>
//       <Wrapper>
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 print:block print:p-0 print:bg-white">
//           {/* <div className="bg-white p-8 shadow-lg rounded-lg max-w-6xl w-full"> */}
//           <div className="bg-white p-8 shadow-lg rounded-lg max-w-6xl w-full print:shadow-none print:p-4 print:rounded-none">
//             <div className="print:hidden flex flex-wrap justify-center md:justify-end gap-2 sm:gap-4 mb-6">
//               <button
//                 onClick={() => window.print()}
//                 className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-full shadow-sm transition"
//               >
//                 🖨️ <span>Print</span>
//               </button>

//               <button
//                 onClick={() => navigate("/admin/dashboard")}
//                 className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-5 py-2 rounded-full shadow-sm transition"
//               >
//                 📊 <span>Dashboard</span>
//               </button>

//               <button
//                 onClick={() => navigate(-1)}
//                 className="inline-flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white font-medium px-5 py-2 rounded-full shadow-sm transition"
//               >
//                 🔙 <span>Back</span>
//               </button>
//             </div>

//             {/* Top Header with Client left and Company right */}
//             <div className="flex flex-col md:flex-row justify-between mb-8 print:flex-row print:gap-10">
//               {/* Client Details - Left */}
//               <div className="md:w-1/2 mb-6 md:mb-0 print:w-1/2">
//                 <h3 className="text-lg font-semibold pb-2 mb-4">
//                   Client Details
//                 </h3>
//                 {/* TODO: Replace static client info if available */}
//                 <p>
//                   <strong>Name:</strong> {clientName}
//                 </p>
//                 <p>
//                   <strong>Contact:</strong> {clientPhone}
//                 </p>
//                 <p>
//                   <strong>Address:</strong> {clientAddress}
//                 </p>
//               </div>

//               {/* Company Details & Quotation Info - Right */}
//               <div className="md:w-1/2 text-right print:w-1/2">
//                 <h1 className="text-3xl font-bold text-indigo-700 mb-1">
//                   DOAGuru InfoSystems
//                 </h1>
//                 <p className="text-gray-600">
//                   1815, Wright Town, Jabalpur, <br /> Madhya Pradesh 482002
//                 </p>
//                 <p className="text-gray-600 mb-4">Phone: 074409 92424</p>

//                 <h2 className="text-xl font-semibold">Quotation</h2>
//                 <p className="text-gray-600">{moment().format("DD/MM/YYYY")}</p>
//                 <p className="text-gray-600">Quote #: {txn_id}</p>
//               </div>
//             </div>

//             {/* Graphic Section */}
//             <section className="mb-10">
//               <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-indigo-700">
//                 Graphic Services
//               </h3>
//               {graphicData.length === 0 && (
//                 <p className="text-center text-gray-500">
//                   No Graphic Services found.
//                 </p>
//               )}
//               {graphicData.map((service, idx) => (
//                 <div key={idx} className="mb-6">
//                   <h4 className="font-semibold text-lg mb-4">
//                     {service.service || "N/A"}
//                   </h4>

//                   {service.categories.map((cat, cidx) => (
//                     <div key={cidx} className="mb-4">
//                       <h5 className="font-semibold mb-2">
//                         {cat.categoryName || "N/A"}
//                       </h5>
//                       <table className="w-full table-fixed border border-gray-300 text-sm">
//                         <thead className="bg-indigo-100">
//                           <tr>
//                             <th className="border px-3 py-2 text-left">
//                               Editing Type
//                             </th>
//                             <th className="border px-3 py-2 text-right">
//                               Quantity
//                             </th>
//                             <th className="border px-3 py-2 text-right">
//                               Price (₹)
//                             </th>
//                             <th className="border px-3 py-2 text-right">
//                               Total (₹)
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {cat.editingTypes.map((edit, eidx) => (
//                             <tr
//                               key={eidx}
//                               className={
//                                 eidx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                               }
//                             >
//                               <td className="border px-3 py-2">{edit.type}</td>
//                               <td className="border px-3 py-2 text-right">
//                                 {edit.quantity}
//                               </td>
//                               <td className="border px-3 py-2 text-right">
//                                 {edit.price.toLocaleString()}
//                               </td>
//                               <td className="border px-3 py-2 text-right">
//                                 {edit.total.toLocaleString()}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ))}
//                 </div>
//               ))}

//               <p className="font-semibold text-right text-lg mt-4">
//                 Graphic Total: ₹{graphicTotal.toLocaleString()}
//               </p>
//             </section>

//             {/* Ads Section */}
//             <section className="mb-10">
//               <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
//                 Ads Services
//               </h3>
//               {adsData.length === 0 && (
//                 <p className="text-center text-gray-500">
//                   No Ads Services found.
//                 </p>
//               )}
//               {adsData.length > 0 && (
//                 <table className="w-full table-fixed border border-gray-300 text-sm">
//                   <thead className="bg-indigo-100">
//                     <tr>
//                       <th className="border px-3 py-2 text-left">Category</th>
//                       <th className="border px-3 py-2 text-right">
//                         Amount (₹)
//                       </th>
//                       <th className="border px-3 py-2 text-right">
//                         Percentage (%)
//                       </th>
//                       <th className="border px-3 py-2 text-right">
//                         Charges (₹)
//                       </th>
//                       <th className="border px-3 py-2 text-right">
//                         Final Total (₹)
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {adsData.map((ad, idx) => (
//                       <tr
//                         key={idx}
//                         className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                       >
//                         <td className="border px-3 py-2">
//                           {ad.category_name || "N/A"}
//                         </td>
//                         <td className="border px-3 py-2 text-right">
//                           {Number(
//                             ad.editing_type_amount || ad.amount || 0
//                           ).toLocaleString()}
//                         </td>
//                         <td className="border px-3 py-2 text-right">
//                           {ad.percent || ad.percentage || 0}
//                         </td>
//                         <td className="border px-3 py-2 text-right">
//                           {Number(ad.charge || 0).toLocaleString()}
//                         </td>
//                         <td className="border px-3 py-2 text-right font-semibold">
//                           {Number(
//                             ad.total_amount || ad.finalTotal || 0
//                           ).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//               <p className="font-semibold text-right text-lg mt-4">
//                 Ads Total: ₹{adsTotal.toLocaleString()}
//               </p>
//             </section>

//             {/* Grand Total */}
//             <section className="border-t pt-4 text-right">
//               <p className="text-2xl font-bold text-indigo-700">
//                 Grand Total: ₹{grandTotal.toLocaleString()}
//               </p>
//             </section>

//             {/* Footer */}
//             <footer className="mt-10 border-t pt-6 text-center text-gray-600 text-sm">
//               <p>Thank you for your business!</p>
//               <p>
//                 Please contact us for any questions regarding this quotation.
//               </p>
//             </footer>
//           </div>
//         </div>
//       </Wrapper>
//     </>
//   );
// }
// const Wrapper = styled.div`
//   @media print {
//     body {
//       margin: 0;
//       padding: 0;
//     }
//   }
// `;
