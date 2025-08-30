import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import Swal from "sweetalert2";
import img1 from "../assets/Dg 1copy.png";
import img2 from "../assets/Dg 2copy.png";
import img3 from "../assets/dghead.jpeg";

export default function QuotationBD(){
  const baseURL = `https://dmcalculator.dentalguru.software`;
  const { id, txn_id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isGST = query.get("gst") === "1";
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [serviceData, setServiceData] = useState([]);
  const [graphicData, setGraphicData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({
    header: false,
    footer: false,
  });
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
      setServiceData(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
        }).then(() => {
          dispatch(clearUser());
          localStorage.removeItem("token");
          navigate("/");
        });
      }
    }
  };

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
        setClientData(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
        }).then(() => {
          dispatch(clearUser());
          localStorage.removeItem("token");
          navigate("/");
        });
      }
    }
  };
  const fetchClientNotes = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getClientNotesbyId/${id}/${txn_id}`,
        {
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        setNotesData(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
        }).then(() => {
          dispatch(clearUser());
          localStorage.removeItem("token");
          navigate("/");
        });
      }
    }
  };

  const clientName = clientData?.client_name;
  const clientAddress = clientData?.address;
  const clientPhone = clientData?.phone;

  useEffect(() => {
    fetchServices();
    fetchClient();
    fetchClientNotes();
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
    // Find service (e.g., Video Services, Video Shoot)
    let service = groupedGraphic.find((s) => s.service === item.service_name);
    if (!service) {
      service = { service: item.service_name, editingTypes: [] };
      groupedGraphic.push(service);
    }

    // Push editing types directly (attach category info in the row if needed)
    service.editingTypes.push({
      category: item.category_name,
      type: item.editing_type_name || "N/A",
      quantity: Number(item.quantity) || 1,
      price: Number(item.editing_type_amount) || 0,
      include_content_posting: Number(item.include_content_posting) || 0,
      include_thumbnail_creation: Number(item.include_thumbnail_creation) || 0,
      total: Number(item.total_amount) || 0,
    });
  });

  setGraphicData(groupedGraphic);
  setAdsData(adsRaw);
  setLoading(false);
}, [serviceData]);
console.log(graphicData);

const graphicTotal = graphicData.reduce(
  (sum, service) =>
    sum +
    service.editingTypes.reduce(
      (editSum, edit) =>
        editSum + (edit.total || edit.price * edit.quantity),
      0
    ),
  0
);





const adsTotal = adsData.reduce((sum, ad) => {
  const amount = Number(ad.amount || 0);
  const totalBudget = Number(ad.total_amount || 0);
  const gstTotal = (amount * 18) / 100;
  return sum + totalBudget + gstTotal;
}, 0);
  const grandTotal = graphicTotal + adsTotal;

  if (loading) {
    return (
      <div className="text-center p-10 font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <Wrapper>
      <div className="page-wrapper w-[210mm] h-[297mm] flex flex-col justify-between p-4  mx-auto bg-white print:break-after-page">
        {/* Hidden on print - Action Buttons */}
        
        <div className="print:hidden flex justify-end gap-3 my-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white rounded-full px-4 py-2"
          >
            🖨️ Print
          </button>
          <button
            onClick={() => navigate(`/admin/ServicesLanding/${id}/${txn_id}`)}
            className="bg-orange-600 text-white rounded-full px-4 py-2"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-teal-600 text-white rounded-full px-4 py-2"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white rounded-full px-4 py-2"
          >
            🔙 Back
          </button>
        </div>

        {/* Table for proper header/footer repetition */}
        <table className="print:table print:border-collapse w-full">
          {/* Repeating Header */}
          <thead className="print:table-header-group w-full">
            <tr>
              <td className="p-0 m-0 w-full">
                <div className="w-full h-auto">
                  <img
                    src={img1}
                    alt="Header"
                    className="w-full h-full object-cover mb-4" // use object-cover for full width fitting
                  />
                </div>
              </td>
            </tr>
          </thead>

          {/* Repeating Footer */}

          {/* Main Content */}
          <tbody className="print:table-row-group">
            <tr>
              <td className="p-0 m-0 align-top">
                <div className="flex flex-col justify-between h-full px-6 py-4 print:px-4 ">
                  <div className="flex-grow">
                    {/* Client Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 print:grid-cols-2">
                      <div className="break-words">
                        <h3 className="text-lg font-semibold mb-2">
                          Client Details
                        </h3>
                        <p className="break-words">
                          <strong>Name:</strong> {clientData?.client_name}
                        </p>
                        <p className="break-words">
                          <strong>Organization Name:</strong>{" "}
                          {clientData?.client_organization}
                        </p>
                        <p className="break-words">
                          <strong>Contact:</strong> {clientData?.phone}
                        </p>
                        <p className="break-words">
                          <strong>Address:</strong> {clientData?.address}
                        </p>
                      </div>
                      <div className="text-end">
                        <h2 className="text-2xl font-bold">
                          {serviceData[0].plan_name} Plan
                        </h2>
                        <p>{moment().format("DD/MM/YYYY")}</p>
                        <p>Quote #: {txn_id}</p>
                      </div>
                      {/* <div className="text-right text-gray-600 break-words">
                    <p>1815, Wright Town, Jabalpur,</p>
                    <p>Madhya Pradesh 482002</p>
                    <p>Phone: 074409 92424</p>
                  </div> */}
                    </div>

                    {/* Graphic Services */}
                 {graphicData.length > 0 && (
  <section className="mb-2">
    <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">
      Graphic Services
    </h3>

    {graphicData.map((service, idx) => (
      <div key={idx} className="mb-6">
        <h4 className="font-semibold text-lg mb-2">{service.service}</h4>

        <table className="w-full border text-sm">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border px-3 py-2 text-left">Category</th>
              <th className="border px-3 py-2 text-left">Creative Type</th>
              <th className="border px-3 py-2 text-right">Quantity</th>
              <th className="border px-3 py-2 text-right">Price (₹)</th>
              <th className="border px-3 py-2 text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {service.editingTypes.map((edit, eidx) => {
              const qty = edit.quantity;
              const base = edit.price;
              const thumb = edit.include_thumbnail_creation;
              const posting = edit.include_content_posting;

              const totalBase = base * qty;
              const totalThumb = thumb * qty;
              const totalPost = posting * qty;

              return (
                <React.Fragment key={eidx}>
                  {/* Base Editing */}
                  <tr className="bg-white">
                    <td className="border px-3 py-2">{edit.category}</td>
                    <td className="border px-3 py-2">{edit.type}</td>
                    <td className="border px-3 py-2 text-right">{qty}</td>
                    <td className="border px-3 py-2 text-right">₹{base}</td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      ₹{totalBase}
                    </td>
                  </tr>

                  {/* Thumbnail */}
                  {thumb > 0 && (
                    <tr className="bg-gray-50">
                      <td className="border px-3 py-2">{edit.category}</td>
                      <td className="border px-3 py-2">Thumbnail Creation</td>
                      <td className="border px-3 py-2 text-right">{qty}</td>
                      <td className="border px-3 py-2 text-right">₹{thumb}</td>
                      <td className="border px-3 py-2 text-right font-semibold">
                        ₹{totalThumb}
                      </td>
                    </tr>
                  )}

                  {/* Content Posting */}
                  {posting > 0 && (
                    <tr className="bg-gray-50">
                      <td className="border px-3 py-2">{edit.category}</td>
                      <td className="border px-3 py-2">Content Posting</td>
                      <td className="border px-3 py-2 text-right">{qty}</td>
                      <td className="border px-3 py-2 text-right">₹{posting}</td>
                      <td className="border px-3 py-2 text-right font-semibold">
                        ₹{totalPost}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    ))}

    <p className="text-right text-lg font-semibold">
      Graphic Total: ₹{graphicTotal.toLocaleString()}
    </p>
  </section>
)}

                    {/* Ads Services */}
               {/* Ads Services */}
{adsData.length > 0 && (
  <section className="mb-5">
    <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
      Ads Services
    </h3>
    <table className="w-full border text-sm">
      <thead className="bg-indigo-100">
        <tr>
          <th className="border px-3 py-2 text-left">Service</th>
          <th className="border px-3 py-2 text-right">Amount (₹)</th>
          <th className="border px-3 py-2 text-right">Percentage (%)</th>
         
          <th className="border px-3 py-2 text-right">Final Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        {adsData.map((ad, idx) => {
          const amount = Number(ad.amount || 0);
          const percent = Number(ad.percent || 0);
          const charge = Number(ad.charge || 0);
          const totalBudget = Number(ad.charge || 0);

          // Static 18% GST row
            const gstPercent = 18;
          const gstCharge = (amount * gstPercent) / 100;
          const gstTotal = amount + gstCharge;

          return (
            <React.Fragment key={idx}>
              {/* Row 1 - dynamic Ad Budget */}

              <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-3 py-2">{ad.category_name} Budget (GST)</td>
                <td className="border px-3 py-2 text-right">
                  {amount.toLocaleString()}
                </td>
                <td className="border px-3 py-2 text-right">{gstPercent}</td>
               
                <td className="border px-3 py-2 text-right font-semibold">
                  {gstTotal.toLocaleString()}
                </td>
              </tr>

              {/* Row 2 - static Ads Charges (18%) */}
              <tr className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border px-3 py-2">{ad.category_name} Charges </td>
                <td className="border px-3 py-2 text-right">
                  {amount.toLocaleString()}
                </td>
                <td className="border px-3 py-2 text-right">{percent}</td>
           
                <td className="border px-3 py-2 text-right font-semibold">
                  {totalBudget.toLocaleString()}
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>

    {/* Ads Total = budget total + gst total */}
    <p className="text-right text-lg font-semibold mt-1">
      Ads Total: ₹
      {adsData
        .reduce((sum, ad) => {
          const amount = Number(ad.amount || 0);
          const totalBudget = Number(ad.total_amount || 0);
          const gstTotal = (amount * 18) / 100;
          return sum + totalBudget + gstTotal;
        }, 0)
        .toLocaleString()}
    </p>
  </section>
)}


                    {/* Grand Total Section */}
                    <section className="text-right border-t pt-3 mb-6">
                      <p className="text-xl text-gray-700">
                        Subtotal: ₹{grandTotal.toLocaleString()}
                      </p>
                      {isGST ? (
                        <>
                          <p className="text-lg text-gray-600 mt-1">
                            GST (18%): ₹{(grandTotal * 0.18).toLocaleString()}
                          </p>
                          <p className="text-2xl font-bold text-indigo-700 mt-2">
                            Total with GST: ₹
                            {(grandTotal * 1.18).toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-indigo-700 mt-2">
                          Grand Total: ₹{grandTotal.toLocaleString()}
                        </p>
                      )}
                    </section>
                    <h2 className="text-lg font-bold">Notes</h2>
                    {notesData.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {notesData.map((note) => (
                          <li
                            key={note.id}
                            className="text-sm text-gray-700 font-bold"
                          >
                            {note.note_name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No notes added.</p>
                    )}
                  </div>
                </div>
                <div className="h-[50rem]"></div>
              </td>
            </tr>
          </tbody>

          <tfoot className="print:table-footer-group">
            <tr>
              <td className="p-0 m-0">
                <div className="h-[100px]">
                  <img
                    src={img2}
                    alt="Footer"
                    className="w-full h-full object-contain"
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  @media print {
    @page {
      size: A4;
      margin: 0;
    }

    html,
    body {
      width: 210mm;
      height: auto;
      margin: 0;
      padding: 0;
    }

    .page-wrapper {
      break-after: page;
      page-break-after: always;
      width: 210mm;
      height: 297mm;
      display: block;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      height: 100%;
      table-layout: fixed;
    }

    thead {
      display: table-header-group;
    }

    tfoot {
      display: table-footer-group;
    }

    tbody {
      display: table-row-group;
      /* height: 80%; */
    }

    tr {
      page-break-inside: avoid;
    }

    td {
      vertical-align: top;
    }
  }
`;

