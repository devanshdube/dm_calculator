import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";

const OPTIONAL_SERVICES = [
  {
    key: "content_posting",
    label: "Content Posting",
    service: "Social Media Optimization",
    category: "Organic Page Optimization",
    editing_type: "Content Posting",
    amount: 400,
  },
  {
    key: "thumbnail_creation",
    label: "Thumbnail Creation",
    service: "Graphics Design",
    category: "Static Graphics",
    editing_type: "Thumbnail Creation",
    amount: 300,
  },
];

const CalculatorBD = () => {
  const baseURL = `http://localhost:5555`;
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
  const [addons, setAddons] = useState(
    OPTIONAL_SERVICES.reduce((acc, item) => {
      acc[item.key] = true;
      return acc;
    }, {})
  );
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  console.log(id, proposalId);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseURL}/auth/api/calculator/services/category/editing`)
      .then((res) => {
        const filtered = filterOptionalServices(res.data.data);
        setData(filtered);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEdit = (entry) => {
    setEditId(entry.id);
    setSelectedService(entry.service_name);
    setSelectedCategory(entry.category_name);
    setSelectedEditingType({
      editing_type_id: entry.editing_type_id, // may need to match from `data`
      editing_type_name: entry.editing_type_name,
      amount: parseFloat(entry.editing_type_amount),
    });
    setQuantity(parseInt(entry.quantity));
    setAddons({
      content_posting: entry.include_content_posting === "1",
      thumbnail_creation: entry.include_thumbnail_creation === "1",
    });
    setTotal(parseFloat(entry.total_amount));
  };

  const filterOptionalServices = (services) => {
    return services
      .map((service) => {
        const filteredCategories = service.categories
          .map((category) => {
            const filteredEditing = category.editing_types.filter((editing) => {
              return !OPTIONAL_SERVICES.some(
                (opt) =>
                  opt.service === service.service_name &&
                  opt.category === category.category_name &&
                  opt.editing_type === editing.editing_type_name
              );
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

    let baseAmount = selectedEditingType.amount * quantity;
    const selectedAddons = [];

    OPTIONAL_SERVICES.forEach((opt) => {
      if (addons[opt.key]) {
        baseAmount += opt.amount * quantity;
        selectedAddons.push(opt.key);
      }
    });

    // OPTIONAL_SERVICES.forEach((opt) => {
    //   if (addons[opt.key]) {
    //     baseAmount += opt.amount;
    //     selectedAddons.push(opt.key);
    //   }
    // });

    setTotal(baseAmount);

    // const payload = {
    //   txn_id: proposalId,
    //   client_id: id,
    //   service_name: selectedService,
    //   category_name: selectedCategory,
    //   editing_type_name: selectedEditingType.editing_type_name,
    //   editing_type_amount: selectedEditingType.amount,
    //   quantity,
    //   addons: selectedAddons,
    //   total_amount: baseAmount,
    // };

    const payload = {
      txn_id: proposalId,
      client_id: id,
      service_name: selectedService,
      category_name: selectedCategory,
      editing_type_name: selectedEditingType.editing_type_name,
      editing_type_amount: selectedEditingType.amount,
      quantity,
      include_content_posting: addons["content_posting"] ? 1 : 0,
      include_thumbnail_creation: addons["thumbnail_creation"] ? 1 : 0,
      total_amount: baseAmount,
      employee: userName,
    };

    console.log(payload);

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
        if (res.data.status === "Success") {
          Swal.fire({
            icon: "success",
            title: editId ? "Updated!" : "Saved!",
            text: editId ? "Entry updated successfully" : "Saved successfully",
          });
          fetchData();
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
      });
  };

  const resetForm = () => {
    setEditId(null);
    setSelectedService("");
    setSelectedCategory("");
    setSelectedEditingType(null);
    setQuantity(1);
    setAddons(
      OPTIONAL_SERVICES.reduce((acc, item) => {
        acc[item.key] = true; // or false, depending on your default
        return acc;
      }, {})
    );
    setTotal(0);
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

  useEffect(() => {
    fetchData();
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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur rounded-xl px-10 py-8 space-y-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            🧮 Service Calculator
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition"
          >
            ← Go Back
          </button>

          <div>
            <label className="block font-semibold mb-1">Select Service</label>
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
                <option key={service.service_id} value={service.service_name}>
                  {service.service_name}
                </option>
              ))}
            </select>
          </div>

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
                    (et) => et.editing_type_id === parseInt(e.target.value)
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

          <div className="space-y-4">
            {OPTIONAL_SERVICES.map((opt) => (
              <div key={opt.key}>
                <label className="block font-semibold">{opt.label}?</label>
                <div className="flex gap-4 mt-2">
                  <button
                    className={`px-4 py-2 rounded ${
                      addons[opt.key]
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                    onClick={() =>
                      setAddons((prev) => ({ ...prev, [opt.key]: true }))
                    }
                  >
                    YES
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      !addons[opt.key]
                        ? "bg-red-600 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                    onClick={() =>
                      setAddons((prev) => ({ ...prev, [opt.key]: false }))
                    }
                  >
                    NO
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded mt-4"
            onClick={handleSave}
          >
            Calculate & Save
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold p-3 rounded mt-2"
            onClick={resetForm}
          >
            Reset Form
          </button>

          {total > 0 && (
            <div className="text-xl font-semibold text-center text-green-300 mt-4">
              Total Amount: ₹{total}
            </div>
          )}
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
                    {(order.include_content_posting === "1" ||
                      order.include_thumbnail_creation === "1") && (
                      <div className="text-base text-white/60 italic">
                        {order.include_content_posting === "1" &&
                          "📢 Content Posting "}
                        {order.include_thumbnail_creation === "1" &&
                          "🖼 Thumbnail Creation"}
                      </div>
                    )}
                    {/* <div className="text-xs text-white/50">
                      🕒 {new Date(order.created_at).toLocaleString("en-IN")}
                    </div> */}
                  </div>

                  {/* Right Section: Amount + Delete */}
                  <div className="flex items-center gap-4">
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
    </>
  );
};

export default CalculatorBD;
