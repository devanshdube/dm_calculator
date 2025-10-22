import React, { useEffect, useState } from "react";
import {
  Palette,
  Megaphone,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Eye,
  ArrowLeft,
  DollarSign,
  Package,
  IndianRupee,
  User,
  Notebook,
  Gift,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { clearUser } from "../redux/user/userSlice";

export default function InvoiceCustomise() {
  const baseURL = `https://dmcalculator.dentalguru.software`;
  const navigate = useNavigate();
  const { id, txn_id } = useParams();
  const [getData, setGetData] = useState([]);
  const [allPlanNote, setAllPlanNote] = useState([]);
  const [getPlanData, setGetPlanData] = useState([]);
  const [getAdsData, setGetAdsData] = useState([]);
  const [getComplimenatryData, setGetComplimenatryData] = useState([]);
  const [planName, setPlanName] = useState("");
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notesData, setNotesData] = useState([]);
  const { currentUser, token } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const userName = currentUser?.name;
  const dispatch = useDispatch();
  console.log(id, txn_id);

  //   const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    {
      id: 1,
      title: "Graphic & SEO ",
      subtitle: "Visual Storytelling",
      description:
        "Transform your brand with stunning visuals that captivate and convert. From logos to complete brand identities.",
      icon: Palette,
      gradient: "from-slate-600 to-gray-700",
      bgPattern: "bg-gradient-to-br from-slate-50 to-gray-50",
      navigation: "/admin/invoice-calculator",
      features: [
        "Logo Design",
        "Brand Identity",
        "Print Materials",
        "Digital Graphics",
        "SEO Services",
      ],
    },
    {
      id: 2,
      title: "Ads Campaigns",
      subtitle: "Strategic Growth",
      description:
        "Amplify your reach with data-driven advertising campaigns that deliver measurable results across all platforms.",
      icon: Megaphone,
      gradient: "from-blue-600 to-slate-700",
      bgPattern: "bg-gradient-to-br from-blue-50 to-slate-50",
      navigation: "/admin/invoice-Adscalculator",
      features: [
        "Social Media Ads",
        "Google Ads",
        "Campaign Strategy",
        "Analytics & ROI",
      ],
    },
    {
      id: 3,
      title: "Notes",
      subtitle: "Key Highlights",
      description:
        "Attach important remarks, reminders, and special conditions to your quotation.",
      icon: FileText, // you can import from lucide-react
      gradient: "from-purple-600 to-indigo-700",
      bgPattern: "bg-gradient-to-br from-purple-50 to-indigo-50",
      navigation: "/admin/invoice-note-section",
      features: [
        "Custom remarks",
        "Special conditions",
        "Internal reminders",
        "Client-specific highlights",
      ],
    },
  ];

  const fetchClient = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getInvoiceClientDetailsById/${id}/${txn_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        console.log(res.data.data);
        setClientData(res.data.data);
        console.log(clientData);
        
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
  const fetchPlanData = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getAllPlanData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        console.log(res.data.data);
        setGetPlanData(res.data.data);
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

  const getAllPlanNotes = async (planTitle) => {
    try {
      const response = await axios.get(
        `${baseURL}/auth/api/calculator/getPlanNotes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const notes = response.data.data;

      // filter for this plan only
      const filtered = notes.filter(
        (note) => String(note.plan) === String(planTitle)
      );

      return filtered; // ⬅️ return directly instead of setting state
    } catch (error) {
      console.error("Error fetching plan notes:", error);
      return [];
    }
  };

  console.log(clientData);
  const clientName = clientData?.client_name;

  const fetchData = async () => {
    if (!id || !txn_id) return;
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getInvoiceGraphic/${txn_id}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.data);
      setGetData(data.data);
      setPlanName(data.data[0].plan_name);
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

  const fetchAdsData = async () => {
    if (!id || !txn_id) return;
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getInvoiceAdsCampaign/${txn_id}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        console.log(res.data);
        setGetAdsData(res.data.data);
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
  const fetchComplimenatryData = async () => {
    if (!id || !txn_id) return;
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
      setGetComplimenatryData(data.data);
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

  useEffect(() => {
    fetchClient();
    fetchData();
    fetchAdsData();
    fetchPlanData();
    fetchClientNotes();
    fetchComplimenatryData();
  }, []);

  // Table Total Amount

  const grandTotal = getData.reduce((acc, order) => {
    // Skip Complimentary service
    if (order.service_name?.toLowerCase() === "complimentary") {
      return acc;
    }

    // Add total_amount if exists, otherwise total_ads
    return acc + parseFloat(order.total_amount || 0);
  }, 0);

  const grandAdsTotal = getAdsData.reduce(
    (acc, order) => acc + parseFloat(order.total || 0),
    0
  );

  const grandComplimentryTotal = getComplimenatryData.reduce(
    (acc, order) => acc + parseFloat(order.total_amount || 0),
    0
  );

  // Table Total Amount

  const graphLength = getData.length;

  const adsCampLength = getAdsData.length;

  const complimenatryLength = getComplimenatryData.length;

  const finalLength = graphLength + adsCampLength + complimenatryLength;

  // Grand Total Amount

  const totalAmount = grandTotal + grandAdsTotal;
  console.log(totalAmount);
  const groupByPlan = (data) => {
    console.log(data);

    const grouped = {};

    data.forEach((item) => {
      if (!grouped[item.plan_id]) {
        grouped[item.plan_id] = {
          id: item.plan_id,
          title: item.plan_name,
          subtitle: "Custom Plan", // you can make this dynamic if needed
          description: `Includes ${item.plan_name} services tailored to your needs.`,
          gradient: "from-green-500 to-teal-600", // default or dynamic
          navigation: "/admin/dynamicPlan",
          features: [],
          totalAmount: 0, // new field for amount
        };
      }

      grouped[item.plan_id].features.push(
        `${item.service_name} - ${item.category_name}`
      );

      // Add the amount (make sure item.amount is a number)
      // Add amount but skip Complimentary services
      if (item.service_name?.toLowerCase() !== "complimentary") {
        grouped[item.plan_id].totalAmount +=
          Number(item.total_amount || item.total_ads) || 0;
      }
    });

    return Object.values(grouped);
  };

  const plans = groupByPlan(getPlanData);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // When "Create Quotation" button is clicked
  const handleCreateQuotation = async (plan) => {
    try {
      const filteredNotes = await getAllPlanNotes(plan.title);

      if (filteredNotes.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Notes",
          text: "No notes found for this plan.",
           showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        });
        return;
      }

      // Step 1: filter plan-wise data
      const filteredPlanData = getPlanData.filter(
        (item) => item.plan_id === plan.id
      );

      if (filteredPlanData.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: "No services found for this plan.",
        });
        return;
      }
      // ✅ Step 2: normal plan services (exclude Ads Campaign & Complimentary)
      const plans = filteredPlanData
        .filter(
          (item) =>
            item.service_name !== "Ads Campaign" &&
            item.service_name !== "Complimentary"
        )
        .map((item) => ({
          service_name: item.service_name,
          category_name: item.category_name,
          editing_type_name: item.editing_type_name,
          editing_type_amount: item.editing_type_amount,
          quantity: item.quantity,
          include_content_posting: item.include_content_posting,
          include_thumbnail_creation: item.include_thumbnail_creation,
          total_amount: item.total_amount,
          plan_name: item.plan_name,
          employee: userName,
        }));

      // ✅ Step 3: Ads Campaign data
      const adsItems = filteredPlanData
        .filter((item) => item.service_name === "Ads Campaign")
        .map((item) => ({
          txn_id: txn_id,
          client_id: id,
          id: generateUniqueId(),
          category: item.category_name,
          amount: item.amount_ads,
          percent: item.percent_ads,
          charge: item.charge_ads,
          total: item.total_ads,
          employee: userName,
        }));

      // ✅ Step 4: Complimentary data
      const complimentaryItems = filteredPlanData
        .filter((item) => item.service_name === "Complimentary")
        .map((item) => ({
          txn_id: txn_id,
          client_id: id,
          service_name: item.service_name,
          category_name: item.category_name,
          editing_type_name: item.editing_type_name,
          editing_type_amount: item.editing_type_amount,
          quantity: item.quantity,
          include_content_posting: item.include_content_posting,
          include_thumbnail_creation: item.include_thumbnail_creation,
          total_amount: item.total_amount,
          employee: userName,
        }));

      // ✅ Step 5: notes
      const planNotes = filteredNotes.map((item) => ({
        note_name: item.note_name,
        plan: item.plan,
      }));

      // ✅ Save plans + notes
      const payload = { txn_id: txn_id, client_id: id, plans, planNotes };

      await axios.post(
        `${baseURL}/auth/api/calculator/savePlanClientNotes`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Save Ads Campaign (if any)
      if (adsItems.length > 0) {
        await axios.post(
          `${baseURL}/auth/api/calculator/saveAdsCampaign`,
          { adsItems },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // ✅ Save Complimentary Services (if any)
      // ✅ Save Complimentary Services (if any)
      if (complimentaryItems.length > 0) {
        for (const item of complimentaryItems) {
          await axios.post(
            `${baseURL}/auth/api/calculator/saveComplimentaryData`,
            item, // send one object at a time
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      Swal.fire({
        icon: "success",
        title: "Quotation Created",
        text: "Plan quotation saved successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      fetchData();
      fetchClientNotes();
      fetchAdsData();
      fetchComplimenatryData();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the quotation.",
         showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleDeleteClientPlanData = async (txn_id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this client plan data permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(
          `${baseURL}/auth/api/calculator/deleteClientAllPlanData/${txn_id}`
        );

        if (res.data.status === "Success") {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Plan has been deleted.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });

          // ✅ Refresh your list instead of reload

          setGetData([]);
          setPlanName("");
          setNotesData([]);
          fetchClientNotes();
          fetchAdsData();
          setGetAdsData([]);
          setGetComplimenatryData([]);
        } else {
          Swal.fire(
            "Error!",
            res.data.message || "Failed to delete plan.",
            "error"
          );
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
    }
  };

  const handleDelete = async (entryId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // red
      cancelButtonColor: "#6b7280", // gray
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${baseURL}/auth/api/calculator/deleteInvoiceById/${entryId}`
      );

      const result = res.data;

      if (result.status === "Success") {
        setGetData((prev) => prev.filter((item) => item.id !== entryId));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Entry has been deleted.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        fetchClientNotes();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to delete entry.",
        });
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to delete entry.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
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
  const handleDeleteComplimenatry = async (entryId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // red
      cancelButtonColor: "#6b7280", // gray
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${baseURL}/auth/api/calculator/deleteInvoiceComplimenatryById/${entryId}`
      );

      const result = res.data;

      if (result.status === "Success") {
        setGetComplimenatryData((prev) =>
          prev.filter((item) => item.id !== entryId)
        );

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Entry has been deleted.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        fetchComplimenatryData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to delete entry.",
        });
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to delete entry.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
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
        `${baseURL}/auth/api/calculator/deleteInvoiceClientNotes/${noteId}`
      );

      const result = res.data;

      if (result.status === "Success") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "note has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });

         setNotesData([]);
          fetchClientNotes();
        
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to delete entry.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
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

  const handleDeleteads = async (entryId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // red
      cancelButtonColor: "#6b7280", // gray
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${baseURL}/auth/api/calculator/deleteInvoiceAdsCampaignEntryById/${entryId}`
      );

      const result = res.data;

      if (result.status === "Success") {
        setGetData((prev) => prev.filter((item) => item.id !== entryId));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Entry has been deleted.",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchAdsData();
        setGetAdsData([]);
        fetchClientNotes();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to delete entry.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
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
  const handleNavigateInovice = (selectedClient,selectedTxn,billType) =>{
    const isGST = billType === "GST";
     navigate(
                      `/admin/invoice/${selectedClient}/${selectedTxn}?gst=${isGST ? 1 : 0}`
                    );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-4">
        {/* Header */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-white/90 text-lg font-medium">
              Invoice Services
            </span>
          </div>
        </div>
        {/* Top Section - Back Button, Total Amount, Client Orders */}
        <div className="mb-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 transform transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back</span>
          </button>

          {/* Top Stats Row */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Total Amount */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium">
                    Total Service Amount
                  </p>
                  <p className="text-3xl font-bold text-white">
                    ₹{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Name */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center justify-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium">
                    Client Name
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {clientName ? clientName : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Orders */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-white">{finalLength}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              {finalLength ? (
                <button
                  onClick={() => {
                  handleNavigateInovice(clientData.client_id,clientData.txn_id,clientData.bill_type)
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-700 to-pink-600 rounded-xl flex items-center justify-center">
                      <Notebook className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-md font-medium">
                        Quotation
                      </p>
                      <p className="text-3xl font-bold text-white  flex items-center justify-center gap-2 group/btn">
                        Preview
                        <ArrowRight className="w-4 h-4 text-white transform transition-transform group-hover/btn:translate-x-1" />
                      </p>
                    </div>
                  </div>
                </button>
              ) : (
                <p className="text-white/60">Not quotation created</p>
              )}
            </div>
          </div>
        </div>
       
        <div className="">
          <p className="text-3xl font-bold text-white mb-3">
           Invoice Customise Service
          </p>
        </div>
        {/* Services Grid */}
        <div className="grid md:grid-cols-4  gap-8  mx-auto mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="group relative">
                {/* Card */}

                <div
                  className={`
                  relative h-full bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20
                  transform transition-all duration-300 hover:scale-102 hover:bg-white/15 hover:border-white/30
                `}
                >
                  {/* Icon with gradient background */}
                  <div
                    className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                    bg-gradient-to-r ${service.gradient} shadow-lg
                    transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                  `}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {service.title}
                      </h3>
                      <p
                        className={`text-sm font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                      >
                        {service.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate(`${service.navigation}/${id}/${txn_id}`);
                      }}
                      className={`
                      w-full mt-6 py-4 px-6 rounded-2xl font-semibold text-white
                      bg-gradient-to-r ${service.gradient} shadow-lg
                      transform transition-all duration-300 hover:shadow-xl hover:scale-105
                      flex items-center justify-center gap-2 group/btn
                    `}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" />
                    </button>
                    <p className="text-white/70 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-white/60"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}
                          ></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                  </div>

                  {/* Hover effect overlay */}
                  {/* <div
                    className={`
                    absolute inset-0 rounded-3xl opacity-0 
                  `}
                  ></div> */}
                </div>

                {/* Floating elements */}
                <div
                  className={`
                  absolute -top-2 -right-2 w-6 h-6 rounded-full 
                  bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100
                  transform transition-all duration-500 group-hover:scale-100 scale-0
                `}
                >
                  <div className="w-full h-full rounded-full animate-ping bg-gradient-to-r from-white/30 to-transparent"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Orders */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Invoice Client Graphic & SEO Orders
            </span>
            <span className="text-lg font-semibold text-green-400">
              Grand Total: ₹{grandTotal.toLocaleString()}
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-white">
              <thead className="text-white/70 border-b border-white/20">
                <tr>
                  <th className="p-3">Index</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Editing Type</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {getData.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/10 border-b border-white/10 transition-colors"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{order.created_at}</td>
                    <td className="p-3">{order.service_name}</td>
                    <td className="p-3">{order.category_name}</td>
                    <td className="p-3">{order.editing_type_name}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">{order.total_amount}</td>
                    <td>
                      <button
                        className="inline-block px-2 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25 mt-1"
                        onClick={() =>
                          navigate(`/admin/invoice-calculator/${id}/${txn_id}`, {
                            state: { servicetype: "paid" },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="inline-block px-2 py-2 mx-1 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25 mt-1"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Invoice Client Campaigns Orders
            </span>
            <span className="text-lg font-semibold text-green-400">
              Grand Total: ₹{grandAdsTotal.toLocaleString()}
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-white">
              <thead className="text-white/70 border-b border-white/20">
                <tr>
                  <th className="p-3">Index</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Amt</th>
                  <th className="p-3">%</th>
                  <th className="p-3">Charge</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {getAdsData.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/10 border-b border-white/10 transition-colors"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{order.created_at}</td>
                    <td className="p-3">{order.category}</td>
                    <td className="p-3">{order.amount}</td>
                    <td className="p-3">{order.percent}</td>
                    <td className="p-3">{order.charge}</td>
                    <td className="p-3">{order.total}</td>
                    <td>
                      {" "}
                      <button
                        className="inline-block px-2 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25 mt-1"
                        onClick={() =>
                          navigate(`/admin/invoice-Adscalculator/${id}/${txn_id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteads(order.id)}
                        className="inline-block px-2 py-2 mx-1 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25 mt-1"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border mt-4 border-white/20 mb-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Invoice Complimenatry Orders
            </span>
            <div className="text-lg font-semibold text-green-400">
              Grand Total: ₹{grandComplimentryTotal.toLocaleString()} , Final
              Total: ₹0
            </div>
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-white">
              <thead className="text-white/70 border-b border-white/20">
                <tr>
                  <th className="p-3">Index</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Editing Type</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {getComplimenatryData.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/10 border-b border-white/10 transition-colors"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{order.created_at}</td>
                    <td className="p-3">{order.service_name}</td>
                    <td className="p-3">{order.category_name}</td>
                    <td className="p-3">{order.editing_type_name}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">{order.total_amount}</td>
                    <td>
                      <button
                        className="inline-block px-2 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25 mt-1"
                        onClick={() =>
                          navigate(`/admin/invoice-calculator/${id}/${txn_id}`, {
                            state: { servicetype: "complimentary" },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComplimenatry(order.id)}
                        className="inline-block px-2 py-2 mx-1 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25 mt-1"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm mt-4 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Invoice Notes Detail
            </span>
            
          </h3>

          <div className="overflow-x-auto">
  
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-white">
              <thead className="text-white/70 border-b border-white/20">
                <tr>
                  <th className="p-3">Plan Client Note</th>

                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {notesData.map((note, index) => (
                  <tr
                    key={note.id}
                    className="hover:bg-white/10 border-b border-white/10 transition-colors"
                  >
                    <td className="p-3">{note.note_name}</td>

                    <td className="p-3">
                      <button
                        className="inline-block px-2 py-2 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25 mt-1"
                        onClick={() =>
                          navigate(`/admin/invoice-calculator/${id}/${txn_id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClientNote(note.id)}
                        className="inline-block px-2 py-2 mx-1 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-200 bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25 mt-1"
                        title="Delete"
                      >
                        Delete
                      </button>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
