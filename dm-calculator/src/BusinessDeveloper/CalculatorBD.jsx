import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useParams } from "react-router-dom";
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
  Clock,
  CheckCircle,
  X,
  StickyNote,
  Notebook,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import AdminComplimentaryData from "../Admin/AdminComplimentaryData";

const CalculatorBD = () => {
  const location = useLocation();
  const [serviceType, setServiceType] = useState("paid");
  const baseURL = `https://dmcalculator.dentalguru.software`;
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state) => state.user);
  const userName = currentUser?.name;
  const { id, proposalId } = useParams();
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEditingType, setSelectedEditingType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [getData, setGetData] = useState([]);
  const [optionalServices, setOptionalServices] = useState([]);

  const [addons, setAddons] = useState({});
  const [loading, setLoading] = useState(false);
  const [optionalAmounts, setOptionalAmounts] = useState([]);

  console.log(data);

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  console.log(id, proposalId);
  const [editId, setEditId] = useState(null);
  const [allPlanNote, setAllPlanNote] = useState([]);
  const [formData, setFormData] = useState({
    note_name: "",
    plan: "Customise",
  });
  const [selectedNotesId, setSelectedNotesId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (location.state?.servicetype) {
      setServiceType(location.state.servicetype);
    }
  }, [location.state]);
useEffect(() => {
  axios
    .get(`${baseURL}/auth/api/calculator/services/category/editing`)
    .then((res) => {
      // Filter out "Complimentary" service
      const filteredServices = res.data.data.filter(
        (service) => service.service_name.toLowerCase() !== "complimentary"
      );
      setData(filteredServices);
    })
    .catch((err) => console.error(err));
}, []);

  useEffect(() => {
    axios
      .get(`${baseURL}/auth/api/calculator/optional-service-amounts`)
      .then((res) => {
        if (res.data.status === "success") {
          const services = res.data.data;
          setOptionalServices(services);

          const initialAddons = {};
          services.forEach((item) => {
            const key = item.editing_type_name
              .toLowerCase()
              .replace(/\s+/g, "_");
            initialAddons[key] = false;
          });
          setAddons(initialAddons);
          setOptionalAmounts(services); // already done in your code
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedService === "Video Services") {
      setAddons({
        thumbnail_creation: true,
        content_posting: true,
      });
    } else if (selectedService === "Graphics Design") {
      setAddons({
        content_posting: true,
        thumbnail_creation: false,
      });
    } else {
      setAddons({});
    }
  }, [selectedService]);

  // useEffect(() => {
  //   if (data.length && optionalServices.length) {
  //     const filtered = filterOptionalServices(data);
  //     setData(filtered);
  //   }
  // }, [data, optionalServices]);

  const getOptionalAddonAmount = (serviceName, editingTypeName) => {
    const match = optionalAmounts.find(
      (item) =>
        item.service_name === serviceName &&
        item.editing_type_name === editingTypeName
    );
    return match ? parseFloat(match.amount) : 0;
  };

  const handleEdit = (entry) => {
    setEditId(entry.id);
    setSelectedService(entry.service_name);
    setSelectedCategory(entry.category_name);
    setSelectedEditingType({
      editing_type_id: entry.editing_type_id,
      editing_type_name: entry.editing_type_name,
      amount: parseFloat(entry.editing_type_amount),
    });
    setQuantity(parseInt(entry.quantity));

    // Dynamically map optional services from entry
    const updatedAddons = {};
    optionalServices.forEach((opt) => {
      const key = opt.editing_type_name.toLowerCase().replace(/\s+/g, "_");
      const entryKey = `include_${key}`;
      updatedAddons[key] = parseFloat(entry[entryKey]) > 0;
    });

    setAddons(updatedAddons);
    setTotal(parseFloat(entry.total_amount));
  };

  const filterOptionalServices = (services) => {
    return services
      .map((service) => {
        const filteredCategories = service.categories
          .map((category) => {
            const filteredEditing = category.editing_types.filter((editing) => {
              // Check if this editing type is an optional service
              const isOptional = optionalServices.some(
                (opt) =>
                  opt.service_name === service.service_name &&
                  opt.category_name === category.category_name &&
                  opt.editing_type_name === editing.editing_type_name
              );
              return !isOptional; // Only keep non-optional services
            });

            return { ...category, editing_types: filteredEditing };
          })
          .filter((cat) => cat.editing_types.length > 0);

        return { ...service, categories: filteredCategories };
      })
      .filter((service) => service.categories.length > 0);
  };

  const getSelectedService = data.find(
    (s) => s.service_name === selectedService
  );
  const getSelectedCategory = getSelectedService?.categories.find(
    (c) => c.category_name === selectedCategory
  );

  const handleSave = () => {
    if (!selectedEditingType) return;
    setLoading(true);
    // Base amount
    let baseAmount = selectedEditingType.amount * quantity;

    // Optional addon values
    let optionalTotal = 0;
    let include_content_posting = 0;
    let include_thumbnail_creation = 0;

    optionalServices.forEach((opt) => {
      const key = opt.editing_type_name.toLowerCase().replace(/\s+/g, "_");
      if (addons[key]) {
        const amount = parseFloat(opt.amount);
        const totalForThisAddon = amount * quantity; // ✅ multiply by quantity

        optionalTotal += totalForThisAddon;

        if (key === "content_posting") {
          include_content_posting = amount; // Send unit amount, not total
        } else if (key === "thumbnail_creation") {
          include_thumbnail_creation = amount; // Send unit amount, not total
        }
      }
    });

    const finalAmount = baseAmount + optionalTotal;
    setTotal(finalAmount);

    const payload = {
      txn_id: proposalId,
      client_id: id,
      service_name: selectedService,
      category_name: selectedCategory,
      editing_type_name: selectedEditingType.editing_type_name,
      editing_type_amount: selectedEditingType.amount,
      quantity,
      include_content_posting,
      include_thumbnail_creation,
      total_amount: finalAmount,
      employee: userName,
    };

    const request = editId
      ? axios.put(
          `${baseURL}/auth/api/calculator/updateGraphicEntryById/${editId}`,
          payload
        )
      : axios.post(
          `${baseURL}/auth/api/calculator/saveCalculatorData`,
          payload
        );

    request
      .then((res) => {
        resetForm();
        if (res.data.status === "Success") {
          Swal.fire({
            icon: "success",
            title: editId ? "Updated!" : "Saved!",
            text: editId ? "Entry updated successfully" : "Saved successfully",
          });
          fetchData();
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Save error:", err);
      });
  };

  const resetForm = () => {
    setEditId(null);
    setSelectedService("");
    setSelectedCategory("");
    setSelectedEditingType(null);
    setQuantity(1);
    const initialAddons = {};
    optionalServices.forEach((item) => {
      const key = item.editing_type_name.toLowerCase().replace(/\s+/g, "_");
      initialAddons[key] = false;
    });
    setAddons(initialAddons);

    setTotal(0);
  };

  const handleShow = () => {
    setFormData({
      note_name: "",
      plan: "Customise",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleClose = () => {
    setShowModal(false);
    setFormData({
      note_name: "",
      plan: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting form data:", formData);
      let response;

      if (isEditing && selectedNotesId) {
        response = await axios.put(
          `${baseURL}/auth/api/calculator/updatePlanNotes/${selectedNotesId.id}`,
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
        }).then(() => {
          setShowModal(false);
          getAllPlanNotes();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.data.message || "Failed to save Note. Please try again.",
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
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save note. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSaveNotes = async () => {
    try {
      const planNotes = allPlanNote.map((item) => ({
        note_name: item.note_name,
        plan: item.plan,
      }));

      const payload = { txn_id: proposalId, client_id: id, planNotes };

      await axios.post(
        `${baseURL}/auth/api/calculator/saveClientIdwiseNotes`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Notes Created",
        text: `Notes saved successfully!`,
      });

      fetchData(); // refresh table
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the notes.",
      });
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this note permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await axios.delete(
        `${baseURL}/auth/api/calculator/deletePlanNotesbyid/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "Success") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Note deleted successfully.",
        });

        // Refresh client list
        getAllPlanNotes();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: response.data.message || "Unable to delete note.",
        });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while deleting note.",
      });
    }
  };

  const fetchData = async () => {
    if (!id || !proposalId) return;
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getByIDCalculatorTransactions/${proposalId}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.data);
      setGetData(data.data);
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
        (note) => String(note.plan) === String(formData.plan) // type safe compare
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
          confirmButtonText: "OK",
        }).then(() => {
          dispatch(clearUser());
          localStorage.removeItem("token");
          navigate("/");
        });
      }
    }
  };
  useEffect(() => {
    fetchData();
    getAllPlanNotes();
  }, [id, proposalId]);

  console.log(getData);

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
        `${baseURL}/auth/api/calculator/deleteGraphicEntryById/${entryId}`
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
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to delete entry.",
        });
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting entry.",
      });
    }
  };
  const grandTotal = getData.reduce(
    (acc, order) => acc + parseFloat(order.total_amount || order.total_ads),
    0
  );

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur rounded-xl px-10 py-8 space-y-6 shadow-2xl">
          <div>
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              🧮 Service Calculator
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition"
            >
              ← Go Back
            </button>

            <label className="block font-semibold mb-1">
              Select Service Type:
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full p-2 border rounded bg-white text-black"
            >
              <option value="">-- Choose Service --</option>
              <option value="paid">Paid Service</option>
              <option value="complimentary">Complimentary Service</option>
            </select>
          </div>
          {serviceType === "paid" ? (
            <div className="">
              <div className="w-full max-w-2xl backdrop-blur rounded-xl px-10 py-8 space-y-6 shadow-2xl">
                <label className="block font-semibold mb-1">
                  Select Service
                </label>
                <select
                  className="w-full p-2 border rounded bg-white text-black"
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    setSelectedCategory("");
                    setSelectedEditingType(null);
                  }}
                >
                  <option value="">-- Choose Service --</option>
                  {data.map((service) => (
                    <option
                      key={service.service_id}
                      value={service.service_name}
                    >
                      {service.service_name}
                    </option>
                  ))}
                </select>

                {getSelectedService && (
                  <div>
                    <label className="block font-semibold mb-1">
                      Select Category
                    </label>
                    <select
                      className="w-full p-2 border rounded bg-white text-black"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedEditingType(null);
                      }}
                    >
                      <option value="">-- Choose Category --</option>
                      {getSelectedService.categories.map((category) => (
                        <option
                          key={category.category_id}
                          value={category.category_name}
                        >
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {getSelectedCategory && (
                  <div>
                    <label className="block font-semibold mb-1">
                      Select Editing Type
                    </label>
                    <select
                      className="w-full p-2 border rounded bg-white text-black"
                      value={selectedEditingType?.editing_type_id || ""}
                      onChange={(e) => {
                        const edit = getSelectedCategory.editing_types.find(
                          (et) =>
                            et.editing_type_id === parseInt(e.target.value)
                        );
                        setSelectedEditingType(edit);
                      }}
                    >
                      <option value="">-- Choose Editing Type --</option>
                      {getSelectedCategory.editing_types.map((edit) => (
                        <option
                          key={edit.editing_type_id}
                          value={edit.editing_type_id}
                        >
                          {edit.editing_type_name} - ₹{edit.amount}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded bg-white text-black"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>

                {selectedService === "Video Services" &&
                  optionalServices?.length > 0 && (
                    <div className="space-y-4">
                      {optionalServices.map((opt) => {
                        const key = opt.editing_type_name
                          .toLowerCase()
                          .replace(/\s+/g, "_");
                        return (
                          <div key={key}>
                            <label className="block font-semibold">
                              {opt.editing_type_name}?
                            </label>
                            <div className="flex gap-4 mt-2">
                              <button
                                type="button"
                                className={`px-4 py-2 rounded ${
                                  addons[key]
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                                onClick={() =>
                                  setAddons((prev) => ({
                                    ...prev,
                                    [key]: true,
                                  }))
                                }
                              >
                                YES
                              </button>
                              <button
                                type="button"
                                className={`px-4 py-2 rounded ${
                                  !addons[key]
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                                onClick={() =>
                                  setAddons((prev) => ({
                                    ...prev,
                                    [key]: false,
                                  }))
                                }
                              >
                                NO
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {selectedService === "Graphics Design" &&
                  optionalServices?.length > 0 && (
                    <div className="space-y-4">
                      {optionalServices.map((opt) => {
                        const key = opt.editing_type_name
                          .toLowerCase()
                          .replace(/\s+/g, "_");
                        return (
                          <div key={key}>
                            <label className="block font-semibold">
                              {opt.editing_type_name}?
                            </label>
                            <div className="flex gap-4 mt-2">
                              <button
                                type="button"
                                className={`px-4 py-2 rounded ${
                                  addons[key]
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                                onClick={() =>
                                  setAddons((prev) => ({
                                    ...prev,
                                    [key]: true,
                                  }))
                                }
                              >
                                YES
                              </button>
                              <button
                                type="button"
                                className={`px-4 py-2 rounded ${
                                  !addons[key]
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                                onClick={() =>
                                  setAddons((prev) => ({
                                    ...prev,
                                    [key]: false,
                                  }))
                                }
                              >
                                NO
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {selectedService === "Graphics Design" &&
                  optionalServices?.length > 0 && (
                    <div className="space-y-4">
                      {optionalServices.map((opt) => {
                        const key = opt.editing_type_name
                          .toLowerCase()
                          .replace(/\s+/g, "_");
                        return (
                          <div key={key}>
                            <label className="block font-semibold">
                              {opt.editing_type_name}?
                            </label>
                            <div className="flex gap-4 mt-2">
                              <button
                                type="button"
                                className={`px-4 py-2 rounded ${
                                  addons[key]
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                                onClick={() =>
                                  setAddons((prev) => ({
                                    ...prev,
                                    [key]: true,
                                  }))
                                }
                              >
                                YES
                              </button>
                              <button
                                type="button"
                                className={`px-4 py-2 rounded ${
                                  !addons[key]
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                                onClick={() =>
                                  setAddons((prev) => ({
                                    ...prev,
                                    [key]: false,
                                  }))
                                }
                              >
                                NO
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded mt-4"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Save..." : "Calculate & Save"}
                </button>
                <button
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold p-3 rounded mt-2"
                  onClick={resetForm}
                >
                  Reset Form
                </button>

                <div className="text-xl font-semibold text-center text-green-300 mt-4">
                  Total Amount: ₹{grandTotal.toLocaleString()}
                </div>

                {/* Client Orders */}

                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Client Orders
                </h3>
                <div className="space-y-4">
                  {getData.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
                        {/* Left Section: Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-semibold text-lg">
                            <Megaphone className="w-5 h-5 text-yellow-400" />
                            <span>
                              {order.service_name} → {order.category_name}
                            </span>
                          </div>
                          <div className="text-lg text-white/80">
                            🎬 {order.editing_type_name} × {order.quantity}
                          </div>
                          {(Number(order.include_content_posting) > 0 ||
                            Number(order.include_thumbnail_creation) > 0) && (
                            <div className="text-base text-white/60 italic">
                              {Number(order.include_content_posting) > 0 && (
                                <>📢 Content Posting </>
                              )}
                              {Number(order.include_thumbnail_creation) > 0 && (
                                <>🖼 Thumbnail Creation </>
                              )}
                            </div>
                          )}
                          {/* <div className="text-xs text-white/50">
                      🕒 {new Date(order.created_at).toLocaleString("en-IN")}
                    </div> */}
                        </div>

                        {/* Right Section: Amount + Delete */}
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="text-green-400 font-bold text-xl">
                            ₹{parseFloat(order.total_amount).toLocaleString()}
                          </div>
                          <button
                            onClick={() => handleEdit(order)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Notes Section
                </h3>

                <button
                  onClick={handleShow}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition"
                >
                  + Add Notes
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 float-end bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
                >
                  💾 Save Notes
                </button>
                <div className="space-y-4">
                  {allPlanNote.map((notes) => (
                    <div
                      key={notes.id}
                      className="p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
                        {/* Left Section: Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-semibold text-lg">
                            <span>→ {notes.note_name}</span>
                          </div>
                        </div>

                        {/* Right Section: Amount + Delete */}
                        <div className="flex items-center gap-2 sm:gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent card onClick
                              setSelectedNotesId(notes);
                              setFormData({
                                note_name: notes.note_name,
                                plan: notes.plan,
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
                            onClick={() => handleDeleteNote(notes.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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

                {/* <div className="space-y-3">
            {getData.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="flex flex-wrap gap-6 text-white items-center">
                  <div className="flex items-center gap-1">
                    <Megaphone className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">
                      {order.service_name} → {order.category_name}
                    </span>
                  </div>
                  <div className="text-sm">
                    🎬 {order.editing_type_name} × {order.quantity}
                  </div>
                  <div className="text-xs italic text-white/70">
                    {order.include_content_posting === "1" &&
                      "📢 Content Posting"}
                    {order.include_thumbnail_creation === "1" &&
                      " 🖼 Thumbnail Creation"}
                  </div>
                  <div className="text-xs text-white/50">
                    🕒 {new Date(order.created_at).toLocaleString("en-IN")}
                  </div>
                  <div className="ml-auto text-green-400 font-bold text-lg">
                    <div className="text-green-400 font-bold text-lg">
                      ₹{parseFloat(order.total_amount).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
              </div>
            </div>
          ) : serviceType === "complimentary" ? (
            <AdminComplimentaryData />
          ) : null}
        </div>
      </div>
    </>
  );
};
export default CalculatorBD;
