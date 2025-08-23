import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { clearUser } from "../redux/user/userSlice";
import img1 from "../assets/Dg 1copy.png";
import img2 from "../assets/Dg 2copy.png";
import img3 from "../assets/dghead.jpeg";

export default function Quotation() {
  const baseURL = `http://localhost:5555`;
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
        `${baseURL}/auth/api/calculator/getClientNotesbyId/${id}`,
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
        include_content_posting: Number(item.include_content_posting) || 0,
        include_thumbnail_creation:
          Number(item.include_thumbnail_creation) || 0,
      });
    });

    setGraphicData(groupedGraphic);
    setAdsData(adsRaw);
    setLoading(false);
  }, [serviceData]);

  const graphicTotal = graphicData.reduce(
    (sum, service) =>
      sum +
      service.categories.reduce(
        (catSum, cat) =>
          catSum +
          cat.editingTypes.reduce(
            (editSum, edit) =>
              editSum + (edit.total || edit.price * edit.quantity),
            0
          ),
        0
      ),
    0
  );

  const adsTotal = adsData.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0
  );
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
      <div className="page-wrapper w-[210mm] h-[297mm] flex flex-col justify-between p-4 border mx-auto bg-white print:break-after-page">
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
                    className="w-full h-full object-cover" // use object-cover for full width fitting
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
                <div className="flex flex-col justify-between h-full px-6 py-4 print:px-4 print:py-6">
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
                          <div key={idx} className="mb-3">
                            <h4 className="font-semibold text-lg mb-2">
                              {service.service}
                            </h4>
                            {service.categories.map((cat, cidx) => (
                              <div key={cidx} className="mb-4">
                                <h5 className="font-semibold mb-2">
                                  {cat.categoryName}
                                </h5>
                                <table className="w-full border text-sm">
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
                                    {cat.editingTypes.map((edit, eidx) => {
                                      const qty = Number(edit.quantity || 0);
                                      const base = Number(edit.price || 0);
                                      const thumb = Number(
                                        edit.include_thumbnail_creation || 0
                                      );
                                      const posting = Number(
                                        edit.include_content_posting || 0
                                      );

                                      const totalBase = base * qty;
                                      const totalThumb = thumb * qty;
                                      const totalPost = posting * qty;

                                      return (
                                        <>
                                          {/* Base Editing */}
                                          <tr
                                            key={`base-${eidx}`}
                                            className="bg-white"
                                          >
                                            <td className="border px-3 py-2">
                                              {edit.type}
                                            </td>
                                            <td className="border px-3 py-2 text-right">
                                              {qty}
                                            </td>
                                            <td className="border px-3 py-2 text-right">
                                              ₹{base.toLocaleString()}
                                            </td>
                                            <td className="border px-3 py-2 text-right font-semibold">
                                              ₹{totalBase.toLocaleString()}
                                            </td>
                                          </tr>

                                          {/* Thumbnail Creation */}
                                          {thumb > 0 && (
                                            <tr
                                              key={`thumb-${eidx}`}
                                              className="bg-gray-50"
                                            >
                                              <td className="border px-3 py-2">
                                                Thumbnail Creation
                                              </td>
                                              <td className="border px-3 py-2 text-right">
                                                {qty}
                                              </td>
                                              <td className="border px-3 py-2 text-right">
                                                ₹{thumb.toLocaleString()}
                                              </td>
                                              <td className="border px-3 py-2 text-right font-semibold">
                                                ₹
                                                {(thumb * qty).toLocaleString()}
                                              </td>
                                            </tr>
                                          )}

                                          {/* Content Posting */}
                                          {posting > 0 && (
                                            <tr
                                              key={`posting-${eidx}`}
                                              className="bg-gray-50"
                                            >
                                              <td className="border px-3 py-2">
                                                Content Posting
                                              </td>
                                              <td className="border px-3 py-2 text-right">
                                                {qty}
                                              </td>
                                              <td className="border px-3 py-2 text-right">
                                                ₹{posting.toLocaleString()}
                                              </td>
                                              <td className="border px-3 py-2 text-right font-semibold">
                                                ₹
                                                {(
                                                  posting * qty
                                                ).toLocaleString()}
                                              </td>
                                            </tr>
                                          )}
                                        </>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        ))}
                        <p className="text-right text-lg font-semibold">
                          Graphic Total: ₹{graphicTotal.toLocaleString()}
                        </p>
                      </section>
                    )}

                    {/* Ads Services */}
                    {adsData.length > 0 && (
                      <section className="mb-5">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
                          Ads Services
                        </h3>
                        <table className="w-full border text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                                Category
                              </th>
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
                                className={
                                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="border px-3 py-2">
                                  {ad.category_name}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                  {Number(ad.amount || 0).toLocaleString()}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                  {ad.percent || 0}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                  {Number(ad.charge || 0).toLocaleString()}
                                </td>
                                <td className="border px-3 py-2 text-right font-semibold">
                                  {Number(
                                    ad.total_amount || 0
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="text-right text-lg font-semibold mt-1">
                          Ads Total: ₹{adsTotal.toLocaleString()}
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
                <div className="h-[45rem]"></div>
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
