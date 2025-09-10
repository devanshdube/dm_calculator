import axios from "axios";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AdminExplorePlans() {
  const [getPlanData, setGetPlanData] = useState([]);
  const { currentUser, token } = useSelector((state) => state.user);
  const [allPlanNote, setAllPlanNote] = useState([]);
  const employeeName = currentUser?.name;
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [planid, setPlanId] = useState("");
  const [planName, setPlanName] = useState("");
  const [formData, setFormData] = useState({
    client_name: "",
    client_organization: "",
    email: "",
    phone: "",
    address: "",
    dg_employee: employeeName,
  });
  const userName = currentUser?.name;
  const baseURL = `https://dmcalculator.dentalguru.software`;
  const navigate = useNavigate();

  const getAllPlanNotes = async () => {
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

      const filtered = notes.filter(
        (note) => String(note.plan) === String(planName) // type safe compare
      );

      console.log("Filtered Notes:", filtered);

      setAllPlanNote(filtered);
    } catch (error) {
      console.error("Error fetching No plan found:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch No plan found. Please try again.",
      });

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

  useEffect(() => {
    if (planName) {
      getAllPlanNotes();
    }
  }, [planName]);

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
      if (item.service_name?.toLowerCase() !== "complimentary") {
        grouped[item.plan_id].totalAmount +=
          Number(item.total_amount || item.total_ads) || 0;
      }
    });

    return Object.values(grouped);
  };

  const plans = groupByPlan(getPlanData);
  // When "Create Quotation" button is clicked

  const handleCreateQuotation = async (plan) => {
    setShowModal(true);
    setPlanId(plan.id);
    setPlanName(plan.title);
  };

  useEffect(() => {
    fetchPlanData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict phone number to digits only and max 10 digits
    if (name === "phone") {
      // Prevent non-numeric input and limit to 10 digits
      if (!/^\d{0,10}$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const proposalId = Date.now(); // txn_id
    console.log("Txn ID:", proposalId);

    try {
      // Step 1: filter plan-wise data
      const filteredPlanData = getPlanData.filter(
        (item) => item.plan_id === planid
      );

      if (filteredPlanData.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: "No services found for this plan.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        return;
      }

      // Step 2: client detail object
      const clientDetail = {
        client_name: formData?.client_name || "",
        client_organization: formData?.client_organization || "",
        email: formData?.email || "",
        phone: formData?.phone || "",
        address: formData?.address || "",
        dg_employee: userName,
      };

      // Step 3: separate Ads Campaign, Complimentary, and other plan services
      const adsItems = filteredPlanData
        .filter((item) => item.service_name === "Ads Campaign")
        .map((item) => ({
          txn_id: proposalId,
          client_id: null, // will get later
          id: generateUniqueId(),
          category: item.category_name,
          amount: item.amount_ads,
          percent: item.percent_ads,
          charge: item.charge_ads,
          total: item.total_ads,
          employee: userName,
        }));

      const complimentaryItems = filteredPlanData
        .filter((item) => item.service_name === "Complimentary")
        .map((item) => ({
          txn_id: proposalId,
          client_id: null, // will get later
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

      // Step 4: notes
      const planNotes = allPlanNote.map((item) => ({
        note_name: item.note_name,
      }));

      // Step 5: save client with plan
      const payload = {
        txn_id: proposalId,
        ...clientDetail,
        plans,
        planNotes,
      };

      const res = await axios.post(
        `${baseURL}/auth/api/calculator/saveClientWithPlan`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { status, message, client_id } = res.data;

      if (status === "Success") {
        // Step 6: Save Ads Campaign if exists
        if (adsItems.length > 0) {
          const adsPayload = {
            adsItems: adsItems.map((item) => ({
              ...item,
              client_id, // link client_id after saving client
            })),
          };

          await axios.post(
            `${baseURL}/auth/api/calculator/saveAdsCampaign`,
            adsPayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // ✅ Step 7: Save Complimentary services (one by one)
        if (complimentaryItems.length > 0) {
          for (const item of complimentaryItems) {
            await axios.post(
              `${baseURL}/auth/api/calculator/saveComplimentaryData`,
              { ...item, client_id }, // attach client_id
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        }

        Swal.fire({
          icon: "success",
          title: "Quotation Created",
          text: message,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setShowModal(false);
        navigate(`/admin/client/service/history/${client_id}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Failed to save quotation",
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
        text: err.response?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="">
        <p className="text-3xl font-bold text-white mb-3">Plan Wise</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mx-auto mb-12">
        {plans.map((plan) => (
          <div key={plan.id} className="group relative">
            <div
              className={`
          relative h-full bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20
          transform transition-all duration-300 hover:scale-102 hover:bg-white/15 hover:border-white/30
        `}
            >
              {/* Icon placeholder */}
              <div
                className={`
            inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
            bg-gradient-to-r ${plan.gradient} shadow-lg
            transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
          `}
              >
                <span className="w-8 h-8 text-white">★</span>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {plan.title}
                  </h3>
                  <p
                    className={`text-sm font-medium bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                  >
                    Plan
                  </p>
                  {/* Total amount */}
                  <p className="text-lg font-semibold text-white mt-1">
                    ₹{plan.totalAmount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleCreateQuotation(plan)}
                  className={`
              w-full mt-6 py-4 px-6 rounded-2xl font-semibold text-white
              bg-gradient-to-r ${plan.gradient} shadow-lg
              transform transition-all duration-300 hover:shadow-xl hover:scale-105
              flex items-center justify-center gap-2 group/btn
            `}
                  disabled={loading}
                >
                  {loading ? "Save..." : "Create Quotation"}
                  <ArrowRight className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" />
                </button>

                <p className="text-white/70 leading-relaxed">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-white/60"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${plan.gradient}`}
                      ></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
              </div>
            </div>

            {/* Floating ping effect */}
            <div
              className={`
          absolute -top-2 -right-2 w-6 h-6 rounded-full 
          bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-100
          transform transition-all duration-500 group-hover:scale-100 scale-0
        `}
            >
              <div className="w-full h-full rounded-full animate-ping bg-gradient-to-r from-white/30 to-transparent"></div>
            </div>
          </div>
        ))}
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
                    {"Add New Client"}
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
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="number"
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
}

export default AdminExplorePlans;
