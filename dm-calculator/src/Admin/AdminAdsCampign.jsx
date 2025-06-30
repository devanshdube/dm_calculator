import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const AdminAdsCampign = () => {
  const baseURL = "http://localhost:5555";
  const [formData, setFormData] = useState({
    ads_category: "",
    amt_range_start: "",
    amt_range_end: "",
    percentage: "",
  });
  const [adsList, setAdsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAds = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getAdsServices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        setAdsList(res.data.data);
      }
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

  useEffect(() => {
    fetchAds();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Ensure numeric fields are actually numbers
  //   const payload = {
  //     ads_category: formData.ads_category,
  //     amt_range_start: Number(formData.amt_range_start),
  //     amt_range_end: formData.amt_range_end,
  //     percentage: Number(formData.percentage),
  //   };

  //   const url = editingId
  //     ? `${baseURL}/auth/api/calculator/updateAdsServices/${editingId}`
  //     : `${baseURL}/auth/api/calculator/insertAdsServices`;

  //   try {
  //     const res = await axios({
  //       method: editingId ? "put" : "post",
  //       url,
  //       data: payload,
  //     });

  //     if (res.data.status === "Success") {
  //       Swal.fire("Success", res.data.message, "success");
  //       setFormData({
  //         ads_category: "",
  //         amt_range_start: "",
  //         amt_range_end: "",
  //         percentage: "",
  //       });
  //       setEditingId(null);
  //       fetchAds();
  //     } else {
  //       Swal.fire("Error", res.data.message, "error");
  //     }
  //   } catch (err) {
  //     Swal.fire(
  //       "Error",
  //       err.response?.data?.message || "Something went wrong",
  //       "error"
  //     );
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `${baseURL}/auth/api/calculator/updateAdsServices/${editingId}`
      : `${baseURL}/auth/api/calculator/insertAdsServices`;

    try {
      const res = await axios({
        method: editingId ? "put" : "post",
        url,
        data: formData,
      });

      console.log(res.data);

      if (res.data.status === "Success") {
        Swal.fire("Success", res.data.message, "success");
        setFormData({
          ads_category: "",
          amt_range_start: "",
          amt_range_end: "",
          percentage: "",
        });
        setEditingId(null);
        fetchAds();
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (err) {
      console.log(err);
      console.log(err.response?.data?.message);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ads_category: item.ads_category,
      amt_range_start: item.amt_range_start,
      amt_range_end: item.amt_range_end,
      percentage: item.percentage,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the ads service!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(
          `${baseURL}/auth/api/calculator/ads/delete/${id}`
        );
        if (res.data.status === "Success") {
          Swal.fire("Deleted!", res.data.message, "success");
          fetchAds();
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-300">
          {editingId ? "✏️ Update Ads Service" : "📊 Add Ads Service"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md p-6 rounded-xl border border-gray-100"
        >
          <input
            type="text"
            name="ads_category"
            placeholder="Ads Category"
            value={formData.ads_category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            name="amt_range_start"
            placeholder="Amount Range Start"
            value={formData.amt_range_start}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            name="amt_range_end"
            placeholder="Amount Range End (or 'Above')"
            value={formData.amt_range_end}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            name="percentage"
            placeholder="Percentage (%)"
            value={formData.percentage}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {editingId ? "🔄 Update Service" : "➕ Add Ads Service"}
          </button>
        </form>

        <div className="bg-white shadow-md p-6 rounded-xl border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">
            📋 Existing Ads Services
          </h3>
          {adsList.length === 0 ? (
            <p className="text-gray-500 text-center">No data found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Start</th>
                    <th className="p-3 text-left">End</th>
                    <th className="p-3 text-left">%</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adsList.map((item, index) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.ads_category}</td>
                      <td className="p-3">{item.amt_range_start}</td>
                      <td className="p-3">{item.amt_range_end}</td>
                      <td className="p-3">{item.percentage}%</td>
                      <td className="p-3">{item.created_at}</td>
                      <td className="p-2 space-x-2 flex">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>

                      {/* <td className="p-3 space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {editingId ? "✏️ Update Ads Service" : "📊 Add Ads Service"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow p-6 rounded-lg"
        >
          <input
            type="text"
            name="ads_category"
            placeholder="Ads Category"
            value={formData.ads_category}
            onChange={handleChange}
            className="border rounded p-2"
          />
          <input
            type="number"
            name="amt_range_start"
            placeholder="Amount Range Start"
            value={formData.amt_range_start}
            onChange={handleChange}
            className="border rounded p-2"
          />
          <input
            type="text"
            name="amt_range_end"
            placeholder="Amount Range End (or 'Above')"
            value={formData.amt_range_end}
            onChange={handleChange}
            className="border rounded p-2"
          />
          <input
            type="number"
            name="percentage"
            placeholder="Percentage (%)"
            value={formData.percentage}
            onChange={handleChange}
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {editingId ? "🔄 Update Service" : "➕ Add Ads Service"}
          </button>
        </form>

        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            📋 Existing Ads Services
          </h3>
          {adsList.length === 0 ? (
            <p className="text-gray-500">No data found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Start</th>
                    <th className="p-2">End</th>
                    <th className="p-2">%</th>
                    <th className="p-2">Created At</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adsList.map((item, index) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{item.ads_category}</td>
                      <td className="p-2">{item.amt_range_start}</td>
                      <td className="p-2">{item.amt_range_end}</td>
                      <td className="p-2">{item.percentage}%</td>
                      <td className="p-2">{item.created_at}</td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div> */}
    </>
  );
};

export default AdminAdsCampign;
