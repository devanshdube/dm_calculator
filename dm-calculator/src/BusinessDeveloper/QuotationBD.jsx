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
import {
 
  Package,
  
  X,
  StickyNote,
  Notebook,
  
  ChevronUp,
  ChevronDown,
} from "lucide-react";
export default function QuotationBD() {
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
  const [selectedplan, setSelectedPlan] = useState("");
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState([]);
  const [clientDataReceived, setClientDataReceived] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({
    header: false,
    footer: false,
  });
    const [formData, setFormData] = useState({
      note_name: "",
      plan: "Customise",
    });
  const [allClientNote, setAllClientNote] = useState([]);
  const [selectedNotesId, setSelectedNotesId] = useState(null);
 const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [predefinedNotes, setPredefinedNotes] = useState([]); // fetched from API
  const [selectedNotes, setSelectedNotes] = useState([]); // selected + manual
  const [manualNote, setManualNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

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

setSelectedPlan(res.data.data[0].plan_name || "Customise");



      
      console.log(serviceData);
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
  
  const fetchComplimentaryData = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getByIDComplimentaryData/${txn_id}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.data);
      setComplimentaryData(data.data);
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

const fetchClientReceived = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getInvoiceClientDetailsById/${id}/${txn_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        setClientDataReceived(res.data.data);
      }
      console.log(clientData);
      
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

    const fetchPredefinedNotes = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getNoteData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredefinedNotes(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

 

  useEffect(() => {
    fetchServices();
    fetchClient();
    fetchClientNotes();
    fetchComplimentaryData();
    fetchDiscount();
    fetchClientReceived();
    fetchPredefinedNotes();

  }, [id, txn_id]);

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      note_name: "",
      plan: "",
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
  
        if (isEditing && selectedNotesId) {
          response = await axios.put(
            `${baseURL}/auth/api/calculator/updateClientNoteDataById/${selectedNotesId.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response.data);
        } else {
          response = await axios.post(
            `${baseURL}/auth/api/calculator/addNotebyplan`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response.data);
        }
  
        console.log("API response:", response.data);
  
        if (response.data.status === "Success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: isEditing
              ? "Note updated successfully!"
              : "Note added successfully!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            setShowModal(false);
       
            fetchClientNotes();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              response.data.message || "Failed to save Note. Please try again.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.error("Error saving Note:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Status:", error.response.status);
          Swal.fire({
            icon: "error",
            title: `Error ${error.response.status}`,
            text:
              error.response.data.message ||
              "Failed to save note. Please try again.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to save note. Please try again.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    const handleAddPredefinedNote = (note) => {
      if (!selectedNotes.find((n) => n.id === note.id)) {
        setSelectedNotes([
          ...selectedNotes,
          { id: note.id, note_name: note.note_text, type: "predefined" },
        ]);
      }
    };
    const handleAddManualNote = () => {
      if (manualNote.trim() !== "") {
        setSelectedNotes([
          ...selectedNotes,
          { id: Date.now(), note_name: manualNote, type: "manual" },
        ]);
        setManualNote("");
      }
    };
  
    const handleRemoveNote = (id) => {
      setSelectedNotes(selectedNotes.filter((note) => note.id !== id));
    };
  const handleSaveNotes = async () => {
    if (selectedNotes.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Notes",
        text: "Please add at least one note before saving.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
  
    try {
      const planNotes = selectedNotes.map((item) => ({
        note_name: item.note_name,
      }));
  
      const payload = {
        txn_id: txn_id,
        client_id: id,
        planNotes,
      };
  
      const res = await axios.post(
        `${baseURL}/auth/api/calculator/saveClientIdwiseNotes`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (res.data.status === "Success") {
        Swal.fire({
          icon: "success",
          title: "Notes Created",
          text: res.data.message,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
  

        setManualNote("");
        setPredefinedNotes([]);
        setSelectedNotes([]);
        fetchPredefinedNotes();
        fetchClientNotes();
      } else if (res.data.status === "Alert") {
        Swal.fire({
          icon: "warning",
          title: "Duplicate Notes",
          text: res.data.message,
  
                showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          
        }
        
      );
    setManualNote("");
        setPredefinedNotes([]);
        setSelectedNotes([]);
        fetchPredefinedNotes();
        fetchClientNotes();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message || "Something went wrong while saving the notes.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the notes.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };
  
  
  

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


  // if (loading) {
  //   return (
  //     <div className="text-center p-10 font-semibold text-gray-700">
  //       Loading...
  //     </div>
  //   );
  // }

    const handleDeleteClientNote = async (noteId) => {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this note ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e11d48", // red
        cancelButtonColor: "#6b7280", // gray
        confirmButtonText: "Yes, delete it!",
      });
  
      if (!confirm.isConfirmed) return;
  
      try {
        const res = await axios.delete(
          `${baseURL}/auth/api/calculator/deletePlanClientNotes/${noteId}`
        );
  
        const result = res.data;
  
        if (result.status === "Success") {
          setNotesData((prev) => prev.filter((item) => item.id !== noteId));
  
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "note has been deleted.",
            timer: 2000,
            showConfirmButton: false,
          });
  

        }
      } catch (error) {
        console.error("Error deleting note:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while deleting entry.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    };
  const clientOrganization = clientData?.client_organization;

  const handlePrintPage = () => {
      document.title = clientOrganization ? `${clientOrganization} Quotation` :`${clientName} Quotation`;
    window.print();
  };
    const handleCreateProposal = () => {
    const txn_id = Date.now(); // generates unique number based on current time
    navigate(`/BD/AddService/${id}/${txn_id}`);
  };

  
  const handleSelect = (note) => {
    handleAddPredefinedNote(note);
     setSelectedNote(null);      
    setIsOpen(false);
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
               {clientDataReceived.tag_received_amt === "received" ? (
                    null
                  ): (
          <button
            onClick={() => navigate(`/BD/AddService/${id}/${txn_id}`)}
            className="bg-orange-600 text-white rounded-full px-4 py-2"
          >
            ✏️ Edit
          </button>
           )}
            {clientDataReceived.tag_received_amt === "received" ? (
                    null
                  ): (
             <button
                      onClick={handleCreateProposal}
                      className=" px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      📝 New  Plan
                    </button>
           )}
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
                          {selectedplan} Plan
                        </h2>
                        <p>{moment().format("DD/MM/YYYY")}</p>
                        <p>Quote: {txn_id}</p>
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
          <th className="border px-3 py-2 text-left">Category</th>
          <th className="border px-3 py-2 text-left">Creative Type</th>
          <th className="border px-3 py-2 text-right">Quantity</th>
          <th className="border px-3 py-2 text-right">Price (₹)</th>
          <th className="border px-3 py-2 text-right">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        {complimentaryData.map((edit, eidx) => {
          const qty = Number(edit.quantity);
          const base = Number(edit.editing_type_amount);
          const thumb = Number(edit.include_thumbnail_creation);
          const posting = Number(edit.include_content_posting);

          const totalBase = base * qty;
          const totalThumb = thumb * qty;
          const totalPost = posting * qty;

          return (
            <React.Fragment key={eidx}>
              {/* Base Editing */}
              <tr className="bg-white">
                <td className="border px-3 py-2">{edit.category_name}</td>
                <td className="border px-3 py-2">{edit.editing_type_name}</td>
                <td className="border px-3 py-2 text-right">{qty}</td>
                <td className="border px-3 py-2 text-right">₹{base}</td>
                <td className="border px-3 py-2 text-right font-semibold">
                  ₹{totalBase}
                </td>
              </tr>

              {/* Thumbnail */}
              {thumb > 0 && (
                <tr className="bg-gray-50">
                  <td className="border px-3 py-2">{edit.category_name}</td>
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
                  <td className="border px-3 py-2">{edit.category_name}</td>
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

<div className=" print:hidden">
  <h3 className="text-xl font-bold  mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Notes Section
                </h3>

                <div className="space-y-4">
                 
 <div className="relative w-full">
      {/* Button to open dropdown */}
       <div
        className="flex items-center justify-between w-full p-2 bg-white rounded-lg border border-gray-300 text-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedNote ? selectedNote.note_text : "-- Select Predefined Note --"}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 bg-white w-full mt-1 max-h-60 overflow-auto border rounded-lg text-black focus:ring-2 focus:ring-purple-500">
          {predefinedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelect(note)}
              className="p-2 m-1 border rounded-lg bg-gray-100 hover:bg-purple-100 cursor-pointer break-words"
            >
              {note.note_text}
            </div>
          ))}
        </div>
      )}
    </div>


                  {/* Manual Note Input */}
                  <div className="flex flex-wrap gap-2">
                    <textarea
                      type="text"
                      value={manualNote}
                      onChange={(e) => setManualNote(e.target.value)}
                      placeholder="Enter custom note"
                      rows={1}
              
                      className="flex-1 p-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleAddManualNote}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Selected Notes List */}
                  <div className="space-y-2">
                    {selectedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-gray-100 rounded-lg gap-5 flex justify-between items-center border border-gray-300"
                      >
                        <span className="text-gray-800 font-medium">
                          {note.note_name}
                        </span>
                        <div className="">
                        <button
                          onClick={() => handleRemoveNote(note.id)}
                          className="bg-red-500 mx-2 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold transition"
                          title="Remove"
                        >
                          ×
                        </button></div>
                      </div>
                    ))}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveNotes}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                  >
                    💾 Save Notes
                  </button>
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
                            <StickyNote className="w-5 h-5 text-blue-600" />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {isEditing ? "Edit Note" : "Add New Note"}
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
                        {/* Note */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Notebook className="w-4 h-4 inline mr-2" />
                            Note
                          </label>
                          <textarea
                            name="note_name"
                            value={formData.note_name}
                            onChange={handleChange}
                            className="w-full text-black px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                            placeholder="Enter note details"
                            rows={4} // number of visible lines
                            required
                          ></textarea>
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
                            {loading
                              ? isEditing
                                ? "Updating..."
                                : "Saving..."
                              : isEditing
                              ? "Update Note"
                              : "Save Note"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                 </div>  
                   {notesData.length > 0 ? (<>

                    <h2 className="text-lg mt-3 font-bold">Notes</h2>
                 
                      <ul className="list-disc pl-5">
                        {notesData.map((note) => (
                          <>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
                          <li
                            key={note.id}
                            className="text-sm text-gray-700 font-bold"
                          >
                            {note.note_name}
                          </li>
                           <div className="flex print:hidden items-center gap-2 sm:gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent card onClick
                              setSelectedNotesId(note);
                              setFormData({
                                note_name: note.note_name,
                                plan: note.plan,
                              });
                              setIsEditing(true);
                              setShowModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteClientNote(note.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Delete"
                          >
                            ×
                          </button>
                          </div>
                          </div>
                          </>
                          
                          
                        ))}
                      </ul>
                       
                    </>
                    
                    ) : (
                      <p className="text-gray-500 italic"></p>
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
