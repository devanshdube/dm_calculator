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
import img3 from "../assets/DOAGURU IT Solution.png";
import img4 from "../assets/DOAGURU Infosystyem.png";
import img5 from "../assets/dghead.jpeg";

export default function BDInvoice() {
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
  const [complimentaryData, setComplimentaryData] = useState([]);
  const [selecteddiscount, setSelecteddiscount] = useState("");
  const [selectedBudget, setSelectedBudgest] = useState(0);
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
        `${baseURL}/auth/api/calculator/getinInvoiceServiceHistory/${id}/${txn_id}`,
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
        `${baseURL}/auth/api/calculator/getInvoiceClientDetailsById/${id}`,
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
        `${baseURL}/auth/api/calculator/getInvoiceClientNotesbyId/${id}/${txn_id}`,
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
  const fetchComplimentaryData = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getComplimentaryInvoiceData/${txn_id}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.data);
      setComplimentaryData(data.data);
      console.log(complimentaryData);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
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
  const fetchDiscount = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getByIDDiscountData/${id}/${txn_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelecteddiscount(data.data[0].discount_per);
    } catch (error) {
      console.error(error);
    }
  };

  const clientName = clientData?.client_name;
  const clientAddress = clientData?.address;
  const clientPhone = clientData?.phone;

  useEffect(() => {
    fetchServices();
    fetchClient();
    fetchClientNotes();
    fetchComplimentaryData();
    fetchDiscount();
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
        include_thumbnail_creation:
          Number(item.include_thumbnail_creation) || 0,
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
        (editSum, edit) => editSum + (edit.total || edit.price * edit.quantity),
        0
      ),
    0
  );
  const complimentaryTotal = complimentaryData.reduce((sum, service) => {
    // prefer total_amount if available, otherwise editing_type_amount * quantity
    const amount =
      service.total_amount !== null && service.total_amount !== undefined
        ? Number(service.total_amount)
        : Number(service.editing_type_amount || 0) *
          Number(service.quantity || 0);

    return sum + amount;
  }, 0);

  const adsTotal = adsData.reduce((sum, ad) => {
    const amount = Number(ad.amount || 0);
    const totalBudget = Number(ad.total_amount || 0);
    const gstTotal = (amount * 18) / 100;
    return sum + totalBudget + gstTotal;
  }, 0);
  const adsTotalBudget = adsData.reduce((sum, ad) => {
    const amount = Number(ad.amount || 0);

    const gstTotal = (amount * 18) / 100;
    return sum + amount + gstTotal;
  }, 0);
  const grandTotalAds = graphicTotal + adsTotal - adsTotalBudget;

  const grandTotal = graphicTotal + adsTotal;

  // Apply discount percentage only for display
  const discountAmount = selecteddiscount
    ? (grandTotalAds * Number(selecteddiscount)) / 100
    : 0;

  const gstexculidingAdsgst = grandTotalAds - discountAmount;
  console.log(gstexculidingAdsgst);

  const totalAfterDiscount = grandTotal - discountAmount;

  // If GST applies on discounted total
  const gstAmount = isGST ? gstexculidingAdsgst * 0.18 : 0;
  console.log(gstAmount);

  const finalTotal = totalAfterDiscount + gstAmount;

  if (loading) {
    return (
      <div className="text-center p-10 font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  const handlePrintPage = () => {
    document.title = `${clientName} Invoice`;
    window.print();
  };
  return (
    <Wrapper>
      <div className="page-wrapper w-[210mm] h-[297mm] flex flex-col justify-between p-4  mx-auto bg-white print:break-after-page">
        {/* Hidden on print - Action Buttons */}

        <div className="print:hidden flex justify-end gap-3 my-4">
          <button
            onClick={handlePrintPage}
            className="bg-blue-600 text-white rounded-full px-4 py-2"
          >
            🖨️ Print
          </button>
          <button
            onClick={() => navigate(`/BD/invoice-edit/${id}/${txn_id}`)}
            className="bg-orange-600 text-white rounded-full px-4 py-2"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => navigate("/BD/dashboard")}
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
                  {isGST ? (
                    <img
                      src={img1}
                      alt="Header"
                      className="w-full h-full object-cover mb-4" // use object-cover for full width fitting
                    />
                  ) : (
                    <img
                      src={img5}
                      alt="Header"
                      className="w-full h-full object-cover mb-4" // use object-cover for full width fitting
                    />
                  )}
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
                    <div className=" flex justify-between">
                      <div className="">
                      
                        <p>
                          <strong>Payment Mode : </strong>{" "}
                          {clientData?.payment_mode}
                        </p>
                         <p>
                          <strong>Service From : </strong>
                          {moment(clientData?.duration_start_date).format(
                            "DD/MM/YYYY"
                          )}{" "}
                          to{" "}
                          {moment(clientData?.duration_end_date).format(
                            "DD/MM/YYYY"
                          )}{" "}
                        </p>
                      </div>

                      <div className="">
                          <p className=" ">
                            <strong>Invoice No : </strong>{clientData.id}
                        </p>
                        <p className="mb-1">
                            <strong>Date :</strong>{" "}
                          {moment(clientData.created_at).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Client Info */}
                      <div className="border p-4 rounded-lg">
                        <h3 className="text-sm font-bold mb-2">BILL TO</h3>
                        <p>
                          <strong>Name :</strong> {clientData?.client_name}
                        </p>
                        {clientData.client_organization ? (
                          <>
                            <p>
                              <strong>Organization :</strong>{" "}
                              {clientData?.client_organization}
                            </p>
                          </>
                        )  : null}
                         <p>
                          <strong>Contact :</strong> {clientData?.phone}
                        </p>

                        
                        {clientData.client_gst_no ? (
                          <>
                            <p>
                              <strong>Gst No :</strong> {clientData?.client_gst_no}
                            </p>
                          </>
                        )  : null}
                        {clientData.client_pan_no ? (
                          <>
                            <p>
                              <strong>Pan No :</strong> {clientData?.client_pan_no}
                            </p>
                          </>
                        )  : null}
{clientData.address ? (
                          <>
                            <p>
                              <strong>Address :</strong> {clientData?.address}
                            </p>
                          </>
                        )  : null}
                       
                       
                      </div>

                      {/* Company Info */}
                      <div className="border p-4 rounded-lg">
                        <h3 className="text-sm font-bold mb-2">FROM</h3>
                        <p>
                          <strong>Company :</strong> DOAGuru Infosystems
                        </p>
                        <p>
                          <strong>Email :</strong> info@doaguru.com
                        </p>
               
                        <p>
                          <strong>Phone :</strong> +91 74409 92424
                        </p>
                                 <p>
                          <strong>GST No :</strong> 23AGLPP2890G1Z7
                        </p>
                        <p>
                          <strong>Address :</strong> 1815, Wright Town, Jabalpur
                        </p>
                      </div>
                    </div>
                    {/* Graphic Services */}
                    {graphicData.length > 0 && (
                      <section className="mb-2">
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">
                          Graphic Services
                        </h3>

                        {graphicData.map((service, idx) => (
                          <div key={idx} className="mb-6">
                            <h4 className="font-semibold text-lg mb-2">
                              {service.service}
                            </h4>

                            <table className="w-full border text-sm">
                              <thead className="bg-indigo-100">
                                <tr>
                                  <th className="border px-3 py-2 text-left">
                                    Category
                                  </th>
                                  <th className="border px-3 py-2 text-left">
                                    Creative Type
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
                                        <td className="border px-3 py-2">
                                          {edit.category}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {edit.type}
                                        </td>
                                        <td className="border px-3 py-2 text-right">
                                          {qty}
                                        </td>
                                        <td className="border px-3 py-2 text-right">
                                          ₹{base}
                                        </td>
                                        <td className="border px-3 py-2 text-right font-semibold">
                                          ₹{totalBase}
                                        </td>
                                      </tr>

                                      {/* Thumbnail */}
                                      {thumb > 0 && (
                                        <tr className="bg-gray-50">
                                          <td className="border px-3 py-2">
                                            {edit.category}
                                          </td>
                                          <td className="border px-3 py-2">
                                            Thumbnail Creation
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            {qty}
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            ₹{thumb}
                                          </td>
                                          <td className="border px-3 py-2 text-right font-semibold">
                                            ₹{totalThumb}
                                          </td>
                                        </tr>
                                      )}

                                      {/* Content Posting */}
                                      {posting > 0 && (
                                        <tr className="bg-gray-50">
                                          <td className="border px-3 py-2">
                                            {edit.category}
                                          </td>
                                          <td className="border px-3 py-2">
                                            Content Posting
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            {qty}
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            ₹{posting}
                                          </td>
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
                              <th className="border px-3 py-2 text-left">
                                Service
                              </th>
                              <th className="border px-3 py-2 text-right">
                                Amount (₹)
                              </th>
                              <th className="border px-3 py-2 text-right">
                                Percentage (%)
                              </th>

                              <th className="border px-3 py-2 text-right">
                                Final Total (₹)
                              </th>
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

                                  <tr
                                    className={
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="border px-3 py-2">
                                      {ad.category_name} Budget (GST)
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {amount.toLocaleString()}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {gstPercent}
                                    </td>

                                    <td className="border px-3 py-2 text-right font-semibold">
                                      {gstTotal.toLocaleString()}
                                    </td>
                                  </tr>

                                  {/* Row 2 - static Ads Charges (18%) */}
                                  <tr
                                    className={
                                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }
                                  >
                                    <td className="border px-3 py-2">
                                      {ad.category_name} Charges{" "}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {amount.toLocaleString()}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {percent}
                                    </td>

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
                    {complimentaryData.length > 0 && (
                      <section className="mb-2">
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">
                          Complimentary Services
                        </h3>

                        <table className="w-full border text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                                Category
                              </th>
                              <th className="border px-3 py-2 text-left">
                                Creative Type
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
                            {complimentaryData.map((edit, eidx) => {
                              const qty = Number(edit.quantity);
                              const base = Number(edit.editing_type_amount);
                              const thumb = Number(
                                edit.include_thumbnail_creation
                              );
                              const posting = Number(
                                edit.include_content_posting
                              );

                              const totalBase = base * qty;
                              const totalThumb = thumb * qty;
                              const totalPost = posting * qty;

                              return (
                                <React.Fragment key={eidx}>
                                  {/* Base Editing */}
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2">
                                      {edit.category_name}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {edit.editing_type_name}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {qty}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      ₹{base}
                                    </td>
                                    <td className="border px-3 py-2 text-right font-semibold">
                                      ₹{totalBase}
                                    </td>
                                  </tr>

                                  {/* Thumbnail */}
                                  {thumb > 0 && (
                                    <tr className="bg-gray-50">
                                      <td className="border px-3 py-2">
                                        {edit.category_name}
                                      </td>
                                      <td className="border px-3 py-2">
                                        Thumbnail Creation
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        {qty}
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        ₹{thumb}
                                      </td>
                                      <td className="border px-3 py-2 text-right font-semibold">
                                        ₹{totalThumb}
                                      </td>
                                    </tr>
                                  )}

                                  {/* Content Posting */}
                                  {posting > 0 && (
                                    <tr className="bg-gray-50">
                                      <td className="border px-3 py-2">
                                        {edit.category_name}
                                      </td>
                                      <td className="border px-3 py-2">
                                        Content Posting
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        {qty}
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        ₹{posting}
                                      </td>
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

                        <p className="text-right text-lg font-semibold">
                          Total: ₹{complimentaryTotal.toLocaleString()}
                        </p>
                        <p className="text-right text-lg font-semibold">
                          Complimentary Total: ₹0
                        </p>
                      </section>
                    )}

                    {/* Grand Total Section */}
                    <section className="text-right border-t pt-3 mb-6">
                      <p className="text-xl text-gray-700">
                        Subtotal: ₹{grandTotal.toLocaleString()}
                      </p>

                      {selecteddiscount > 0 && (
                        <p className="text-lg text-red-600 mt-1">
                          Discount ({selecteddiscount}%): -₹
                          {discountAmount.toFixed(2).toLocaleString()}
                        </p>
                      )}

                      {isGST ? (
                        <>
                          <p className="text-lg text-gray-600 mt-1">
                            GST (18%): ₹{gstAmount.toLocaleString()}
                          </p>
                          <p className="text-2xl font-bold text-indigo-700 mt-2">
                            Total with GST: ₹{finalTotal.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-indigo-700 mt-2">
                          Grand Total: ₹
                          {totalAfterDiscount.toFixed(2).toLocaleString()}
                        </p>
                      )}
                    </section>

                    {notesData.length > 0 ? (
                      <>
                        <h2 className="text-lg font-bold">Notes</h2>
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
                      </>
                    ) : (
                      <p className="text-gray-500 italic"></p>
                    )}
                  </div>
                  {isGST ? (
                    <>
                      <div className=" flex justify-between">
                        {/* Bank Details */}
                        <div className="font-bold mt-12 ">
                          <h6>Bank Details: -</h6>

                          <ul className="space-y-1">
                            <li>Name: DOAGuru InfoSystems</li>
                            <li>IFSC Code: SBIN0004677</li>
                            <li>Account No: 38666325192</li>
                            <li>Bank: SBI Bank, Jabalpur</li>
                          </ul>
                        </div>

                        {/* Signature */}
                        <div className="">
                          <img
                            src={img4}
                            alt="Authorized Signature"
                            height={100}
                            width={200}
                            style={{ marginTop: "-2.5rem" }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className=" flex justify-between">
                      <div className="font-bold mt-12 ">
                        <h6>Bank Details For TDS Payment : - </h6>
                        <ul>
                          <li>Name : DOAGuru IT Solutions</li>
                          <li>IFSC Code : HDFC0000224 </li>
                          <li>Account No : 50200074931981</li>
                          <li>Bank : HDFC Bank , Jabalpur</li>
                        </ul>
                      </div>
                      <div className="">
                        <img
                          src={img3}
                          alt="Authorized Signature"
                          height={100}
                          width={200}
                          style={{ marginTop: "-2.5rem" }}
                        />
                      </div>
                    </div>
                  )}
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
