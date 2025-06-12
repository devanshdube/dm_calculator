// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { } from "lucide-react";

// const AdminAddServices = () => {
//   const baseURL = "http://localhost:5555";
//   const [serviceName, setServiceName] = useState("");
//   const [categoryName, setCategoryName] = useState("");
//   const [editingTypeName, setEditingTypeName] = useState("");

//   const [services, setServices] = useState([]);
//   const [selectedServiceId, setSelectedServiceId] = useState("");

//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get(
//         `${baseURL}/auth/api/calculator/getAddServices`
//       );
//       setServices(res.data.data);
//       console.log("Fetched services:", res.data.data);
//     } catch (err) {
//       console.error("Error fetching services:", err);
//     }
//   };

//   const fetchCategories = async (service_id) => {
//     try {
//       const res = await axios.get(
//         `${baseURL}/auth/api/calculator/categories/${service_id}`
//       );
//       setCategories(res.data.data);
//       console.log("Fetched categories:", res.data.data);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const addService = async () => {
//     if (!serviceName) return alert("Service name is required.");
//     try {
//       const res = await axios.post(
//         `${baseURL}/auth/api/calculator/addServices`,
//         {
//           service_name: serviceName,
//         }
//       );
//       alert(res.data.message);
//       setServiceName("");
//       fetchServices();
//     } catch (err) {
//       console.error("Error adding service:", err);
//     }
//   };

//   const addCategory = async () => {
//     if (!selectedServiceId || !categoryName) {
//       return alert("Select service and provide category name.");
//     }
//     try {
//       const res = await axios.post(
//         `${baseURL}/auth/api/calculator/addCategories`,
//         {
//           service_id: selectedServiceId,
//           category_name: categoryName,
//         }
//       );
//       alert(res.data.message);
//       setCategoryName("");
//       fetchCategories(selectedServiceId);
//     } catch (err) {
//       console.error("Error adding category:", err);
//     }
//   };

//   const addEditingType = async () => {
//     if (!selectedServiceId || !selectedCategoryId || !editingTypeName) {
//       return alert("All fields are required.");
//     }
//     try {
//       const res = await axios.post(
//         `${baseURL}/auth/api/calculator/addEditingTypes`,
//         {
//           service_id: selectedServiceId,
//           category_id: selectedCategoryId,
//           editing_type_name: editingTypeName,
//         }
//       );
//       alert(res.data.message);
//       setEditingTypeName("");
//     } catch (err) {
//       console.error("Error adding editing type:", err);
//     }
//   };

//   return (
//     <>
//       <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
//         <h2 className="text-xl font-semibold text-center">Service Manager</h2>

//         {/* Add Service */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Add Service</label>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={serviceName}
//               onChange={(e) => setServiceName(e.target.value)}
//               placeholder="Enter Service Name"
//               className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
//             />
//             <button
//               onClick={addService}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Add Category */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Add Category</label>
//           <select
//             className="w-full border rounded px-3 py-2"
//             onChange={(e) => {
//               setSelectedServiceId(e.target.value);
//               fetchCategories(e.target.value);
//             }}
//             value={selectedServiceId}
//           >
//             <option value="">Select Service</option>
//             {services.map((s) => (
//               <option key={s.service_id} value={s.service_id}>
//                 {s.service_name}
//               </option>
//             ))}
//           </select>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               placeholder="Enter Category Name"
//               className="flex-1 border rounded px-3 py-2"
//             />
//             <button
//               onClick={addCategory}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Add Editing Type */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium">Add Editing Type</label>
//           <select
//             className="w-full border rounded px-3 py-2"
//             onChange={(e) => setSelectedCategoryId(e.target.value)}
//             value={selectedCategoryId}
//           >
//             <option value="">Select Category</option>
//             {categories.map((c) => (
//               <option key={c.category_id} value={c.category_id}>
//                 {c.category_name}
//               </option>
//             ))}
//           </select>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={editingTypeName}
//               onChange={(e) => setEditingTypeName(e.target.value)}
//               placeholder="Enter Editing Type Name"
//               className="flex-1 border rounded px-3 py-2"
//             />
//             <button
//               onClick={addEditingType}
//               className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminAddServices;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminAddServices = () => {
  const baseURL = "http://localhost:5555";
  const [serviceName, setServiceName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editingTypeName, setEditingTypeName] = useState("");

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getAddServices`
      );
      setServices(res.data.data);
    } catch (err) {
      console.log("Error fetching services:", err);

      Swal.fire("Error", "Failed to fetch services", "error");
    }
  };

  const fetchCategories = async (service_id) => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/categories/${service_id}`
      );
      setCategories(res.data.data);
    } catch (err) {
      console.log("Error fetching categories:", err);

      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  const addService = async () => {
    if (!serviceName.trim()) {
      return Swal.fire("Validation", "Service name is required", "warning");
    }
    try {
      const res = await axios.post(
        `${baseURL}/auth/api/calculator/addServices`,
        {
          service_name: serviceName,
        }
      );
      Swal.fire("Success", res.data.message, "success");
      setServiceName("");
      fetchServices();
    } catch (err) {
      console.log("Error adding service:", err);

      Swal.fire("Error", "Could not add service", "error");
    }
  };

  const addCategory = async () => {
    if (!selectedServiceId || !categoryName.trim()) {
      return Swal.fire(
        "Validation",
        "Select service and enter category name",
        "warning"
      );
    }
    try {
      const res = await axios.post(
        `${baseURL}/auth/api/calculator/addCategories`,
        {
          service_id: selectedServiceId,
          category_name: categoryName,
        }
      );
      Swal.fire("Success", res.data.message, "success");
      setCategoryName("");
      fetchCategories(selectedServiceId);
    } catch (err) {
      console.log("Error adding category:", err);

      Swal.fire("Error", "Could not add category", "error");
    }
  };

  const addEditingType = async () => {
    if (!selectedServiceId || !selectedCategoryId || !editingTypeName.trim()) {
      return Swal.fire("Validation", "All fields are required", "warning");
    }
    try {
      const res = await axios.post(
        `${baseURL}/auth/api/calculator/addEditingTypes`,
        {
          service_id: selectedServiceId,
          category_id: selectedCategoryId,
          editing_type_name: editingTypeName,
        }
      );
      Swal.fire("Success", res.data.message, "success");
      setEditingTypeName("");
    } catch (err) {
      console.log("Error adding editing type:", err);

      Swal.fire("Error", "Could not add editing type", "error");
    }
  };

  //   const deleteService = async (id) => {
  //     await axios.delete(`/api/service/${id}`);
  //     fetchServices();
  //   };

  //   const deleteCategory = async (id) => {
  //     await axios.delete(`/api/category/${id}`);
  //     fetchCategories();
  //   };

  //   const deleteEditingType = async (id) => {
  //     await axios.delete(`/api/editingType/${id}`);
  //     //   fetchAllEditingTypes();
  //   };

  return (
    <>
      {/* <div className="max-w-4xl mx-auto p-6 space-y-10"> */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            🎛️ Service Management Panel
          </h2>

          {/* Add Service */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              ➕ Add New Service
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter Service Name"
                className="w-full sm:flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addService}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Add Service
              </button>
            </div>
          </div>

          {/* Add Category */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              📁 Add Category
            </h3>
            <div className="space-y-3">
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedServiceId(val);
                  setSelectedCategoryId("");
                  setCategories([]);
                  if (val) fetchCategories(val);
                }}
                value={selectedServiceId}
              >
                <option value="">-- Select Service --</option>
                {services.map((s) => (
                  <option key={s.service_id} value={s.service_id}>
                    {s.service_name}
                  </option>
                ))}
              </select>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter Category Name"
                  className="w-full sm:flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                />
                <button
                  onClick={addCategory}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>

          {/* Add Editing Type */}
          {categories.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                ✂️ Add Editing Type
              </h3>
              <div className="space-y-3">
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  value={selectedCategoryId}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="text"
                    value={editingTypeName}
                    onChange={(e) => setEditingTypeName(e.target.value)}
                    placeholder="Enter Editing Type Name"
                    className="w-full sm:flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                  />
                  <button
                    onClick={addEditingType}
                    className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
                  >
                    Add Editing Type
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Right Panel: Side Lists */}
        {/* <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2 text-blue-700">
              🧰 Services
            </h4>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li
                  key={s.service_id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>{s.service_name}</span>
                  <button
                    onClick={() => deleteService(s.service_id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2 text-green-700">
              📁 Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li
                  key={c.category_id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>{c.category_name}</span>
                  <button
                    onClick={() => deleteCategory(c.category_id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2 text-purple-700">
              ✂️ Editing Types
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map((e) => (
                <li
                  key={e.editing_type_id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>{e.editing_type_name}</span>
                  <button
                    onClick={() => deleteEditingType(e.editing_type_id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default AdminAddServices;

//   const [selectedService, setSelectedService] = useState("");

//   const clients = [
//     {
//       id: 1,
//       name: "Acme Corporation",
//       contact: "John Smith",
//       email: "john@acme.com",
//       phone: "+1 (555) 123-4567",
//       location: "New York, NY",
//       status: "Active",
//       lastContact: "2024-06-05",
//       value: "$125,000",
//     },
//     {
//       id: 2,
//       name: "TechStart Inc",
//       contact: "Sarah Wilson",
//       email: "sarah@techstart.com",
//       phone: "+1 (555) 987-6543",
//       location: "San Francisco, CA",
//       status: "Prospect",
//       lastContact: "2024-06-03",
//       value: "$85,000",
//     },
//     {
//       id: 3,
//       name: "Global Solutions",
//       contact: "Mike Johnson",
//       email: "mike@globalsol.com",
//       phone: "+1 (555) 456-7890",
//       location: "Chicago, IL",
//       status: "Active",
//       lastContact: "2024-06-01",
//       value: "$200,000",
//     },
//   ];

//   const services = [
//     {
//       id: 1,
//       name: "Add BD",
//       price: "$5,000 - $25,000",
//       duration: "4-12 weeks",
//     },
//     {
//       id: 2,
//       name: "Mobile App Development",
//       price: "$10,000 - $50,000",
//       duration: "8-20 weeks",
//     },
//     {
//       id: 3,
//       name: "Digital Marketing",
//       price: "$2,000 - $10,000",
//       duration: "3-6 months",
//     },
//     {
//       id: 4,
//       name: "Brand Identity Design",
//       price: "$3,000 - $15,000",
//       duration: "3-8 weeks",
//     },
//     {
//       id: 5,
//       name: "E-commerce Solution",
//       price: "$8,000 - $35,000",
//       duration: "6-16 weeks",
//     },
//     {
//       id: 6,
//       name: "Consulting Services",
//       price: "$150 - $300/hour",
//       duration: "Ongoing",
//     },
//   ];

{
  /* <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Select Service</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                selectedService === service.name
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedService(service.name)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  {selectedService === service.name && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {service.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Price:</span>
                    <span>{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedService && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Service Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Service
                </label>
                <input
                  type="text"
                  value={selectedService}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <input
                  type="text"
                  placeholder="Enter budget"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Add any additional notes or requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Proposal
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
            </div>
          </div>
        )}
      </div> */
}
