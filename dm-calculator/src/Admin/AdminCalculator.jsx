// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useParams } from "react-router-dom";

// const OPTIONAL_SERVICES = [
//   {
//     service: "Social Media Optimization",
//     category: "Organic Page Optimization",
//     editing_type: "Content Posting",
//     amount: 400,
//   },
//   {
//     service: "Graphics Design",
//     category: "Static Graphics",
//     editing_type: "Thumbnail Creation",
//     amount: 300,
//   },
// ];

// const AdminCalculator = () => {
//   const baseURL = `http://localhost:5555`;
//   const { id } = useParams();
//   const [data, setData] = useState([]);
//   const [selectedService, setSelectedService] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedEditingType, setSelectedEditingType] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [includeContentPosting, setIncludeContentPosting] = useState(false);
//   const [includeThumbnailCreation, setIncludeThumbnailCreation] =
//     useState(false);

//   const [total, setTotal] = useState(0);

//   console.log(
//     selectedService,
//     selectedCategory,
//     selectedEditingType,
//     quantity,
//     includeContentPosting,
//     includeThumbnailCreation,
//     total
//   );
//   console.log(id);

//   useEffect(() => {
//     axios
//       .get(`${baseURL}/auth/api/calculator/services/category/editing`)
//       .then((res) => {
//         const filtered = filterOptionalServices(res.data.data);
//         setData(filtered);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   const filterOptionalServices = (services) => {
//     return services
//       .map((service) => {
//         const filteredCategories = service.categories
//           .map((category) => {
//             const filteredEditing = category.editing_types.filter((editing) => {
//               return !OPTIONAL_SERVICES.some(
//                 (opt) =>
//                   opt.service === service.service_name &&
//                   opt.category === category.category_name &&
//                   opt.editing_type === editing.editing_type_name
//               );
//             });
//             return { ...category, editing_types: filteredEditing };
//           })
//           .filter((cat) => cat.editing_types.length > 0);

//         return { ...service, categories: filteredCategories };
//       })
//       .filter((service) => service.categories.length > 0);
//   };

//   // const handleCalculate = () => {
//   //   if (!selectedEditingType) return;
//   //   let baseAmount = selectedEditingType.amount * quantity;
//   //   if (includeOptional) {
//   //     baseAmount += OPTIONAL_SERVICES.reduce((sum, s) => sum + s.amount, 0);
//   //   }
//   //   setTotal(baseAmount);
//   // };

//   // const handleCalculate = () => {
//   //   if (!selectedEditingType) return;

//   //   let baseAmount = selectedEditingType.amount * quantity;

//   //   if (includeContentPosting) {
//   //     baseAmount += OPTIONAL_SERVICES[0].amount; // Content Posting
//   //   }
//   //   if (includeThumbnailCreation) {
//   //     baseAmount += OPTIONAL_SERVICES[1].amount; // Thumbnail Creation
//   //   }

//   //   setTotal(baseAmount);
//   // };

//   const getSelectedService = data.find(
//     (s) => s.service_name === selectedService
//   );
//   const getSelectedCategory = getSelectedService?.categories.find(
//     (c) => c.category_name === selectedCategory
//   );

//   const handleSave = () => {
//     if (!selectedEditingType) return;

//     let baseAmount = selectedEditingType.amount * quantity;

//     if (includeContentPosting) {
//       baseAmount += OPTIONAL_SERVICES[0].amount; // Content Posting
//     }
//     if (includeThumbnailCreation) {
//       baseAmount += OPTIONAL_SERVICES[1].amount; // Thumbnail Creation
//     }

//     setTotal(baseAmount);

//     const payload = {
//       client_id: id,
//       service_name: selectedService,
//       category_name: selectedCategory,
//       editing_type_name: selectedEditingType.editing_type_name,
//       editing_type_amount: selectedEditingType.amount,
//       quantity,
//       include_content_posting: includeContentPosting,
//       include_thumbnail_creation: includeThumbnailCreation,
//       total_amount: baseAmount,
//     };

//     axios
//       .post(`${baseURL}/auth/api/calculator/saveCalculatorData`, payload)
//       .then((res) => {
//         if (res.data.status === "Success") {
//           Swal.fire({
//             icon: "success",
//             title: "Success",
//             text: "Saved Successfully!",
//           });
//         }
//       })
//       .catch((err) => {
//         console.error("Save error:", err);
//       });
//   };

//   return (
//     <>
//       <div className="max-w-xl mx-auto p-6 space-y-4">
//         <h2 className="text-2xl font-bold text-gray-800">
//           🧮 Service Calculator
//         </h2>

//         <div>
//           <label className="block font-medium">Select Service</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedService}
//             onChange={(e) => {
//               setSelectedService(e.target.value);
//               setSelectedCategory("");
//               setSelectedEditingType(null);
//             }}
//           >
//             <option value="">-- Choose Service --</option>
//             {data.map((service) => (
//               <option key={service.service_id} value={service.service_name}>
//                 {service.service_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {getSelectedService && (
//           <div>
//             <label className="block font-medium">Select Category</label>
//             <select
//               className="w-full p-2 border rounded"
//               value={selectedCategory}
//               onChange={(e) => {
//                 setSelectedCategory(e.target.value);
//                 setSelectedEditingType(null);
//               }}
//             >
//               <option value="">-- Choose Category --</option>
//               {getSelectedService.categories.map((category) => (
//                 <option
//                   key={category.category_id}
//                   value={category.category_name}
//                 >
//                   {category.category_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {getSelectedCategory && (
//           <div>
//             <label className="block font-medium">Select Editing Type</label>
//             <select
//               className="w-full p-2 border rounded"
//               value={selectedEditingType?.editing_type_id || ""}
//               onChange={(e) => {
//                 const edit = getSelectedCategory.editing_types.find(
//                   (et) => et.editing_type_id === parseInt(e.target.value)
//                 );
//                 setSelectedEditingType(edit);
//               }}
//             >
//               <option value="">-- Choose Editing Type --</option>
//               {getSelectedCategory.editing_types.map((edit) => (
//                 <option key={edit.editing_type_id} value={edit.editing_type_id}>
//                   {edit.editing_type_name} - ₹{edit.amount}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <div>
//           <label className="block font-medium">Quantity</label>
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             min={1}
//             value={quantity}
//             onChange={(e) => setQuantity(parseInt(e.target.value))}
//           />
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block font-medium">
//               Include Content Posting?
//             </label>
//             <div className="flex gap-4 mt-2">
//               <button
//                 className={`px-4 py-2 rounded ${
//                   includeContentPosting
//                     ? "bg-green-600 text-white"
//                     : "bg-gray-200"
//                 }`}
//                 onClick={() => setIncludeContentPosting(true)}
//               >
//                 YES
//               </button>
//               <button
//                 className={`px-4 py-2 rounded ${
//                   !includeContentPosting
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-200"
//                 }`}
//                 onClick={() => setIncludeContentPosting(false)}
//               >
//                 NO
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium">
//               Include Thumbnail Creation?
//             </label>
//             <div className="flex gap-4 mt-2">
//               <button
//                 className={`px-4 py-2 rounded ${
//                   includeThumbnailCreation
//                     ? "bg-green-600 text-white"
//                     : "bg-gray-200"
//                 }`}
//                 onClick={() => setIncludeThumbnailCreation(true)}
//               >
//                 YES
//               </button>
//               <button
//                 className={`px-4 py-2 rounded ${
//                   !includeThumbnailCreation
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-200"
//                 }`}
//                 onClick={() => setIncludeThumbnailCreation(false)}
//               >
//                 NO
//               </button>
//             </div>
//           </div>
//         </div>

//         <button
//           className="w-full bg-blue-600 text-white p-2 rounded mt-4"
//           onClick={handleSave}
//         >
//           Calculate Total
//         </button>

//         {total > 0 && (
//           <div className="text-xl font-semibold text-center text-green-700 mt-4">
//             Total Amount: ₹{total}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AdminCalculator;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

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

const AdminCalculator = () => {
  const baseURL = `http://localhost:5555`;
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEditingType, setSelectedEditingType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addons, setAddons] = useState(
    OPTIONAL_SERVICES.reduce((acc, item) => {
      acc[item.key] = true;
      return acc;
    }, {})
  );
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios
      .get(`${baseURL}/auth/api/calculator/services/category/editing`)
      .then((res) => {
        const filtered = filterOptionalServices(res.data.data);
        setData(filtered);
      })
      .catch((err) => console.error(err));
  }, []);

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
        baseAmount += opt.amount;
        selectedAddons.push(opt.key);
      }
    });

    setTotal(baseAmount);

    const payload = {
      client_id: id,
      service_name: selectedService,
      category_name: selectedCategory,
      editing_type_name: selectedEditingType.editing_type_name,
      editing_type_amount: selectedEditingType.amount,
      quantity,
      addons: selectedAddons,
      total_amount: baseAmount,
    };

    axios
      .post(`${baseURL}/auth/api/calculator/saveCalculatorData`, payload)
      .then((res) => {
        if (res.data.status === "Success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Saved Successfully!",
          });
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur rounded-xl px-10 py-8 space-y-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          🧮 Service Calculator
        </h2>

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
            <label className="block font-semibold mb-1">Select Category</label>
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
                <option key={edit.editing_type_id} value={edit.editing_type_id}>
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

        {total > 0 && (
          <div className="text-xl font-semibold text-center text-green-300 mt-4">
            Total Amount: ₹{total}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCalculator;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useParams } from "react-router-dom";

// const OPTIONAL_SERVICES = [
//   {
//     key: "content_posting",
//     label: "Content Posting",
//     service: "Social Media Optimization",
//     category: "Organic Page Optimization",
//     editing_type: "Content Posting",
//     amount: 400,
//   },
//   {
//     key: "thumbnail_creation",
//     label: "Thumbnail Creation",
//     service: "Graphics Design",
//     category: "Static Graphics",
//     editing_type: "Thumbnail Creation",
//     amount: 300,
//   },
// ];

// const AdminCalculator = () => {
//   const baseURL = `http://localhost:5555`;
//   const { id } = useParams();

//   const [data, setData] = useState([]);
//   const [selectedService, setSelectedService] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedEditingType, setSelectedEditingType] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [optionalSelections, setOptionalSelections] = useState({});
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     axios
//       .get(`${baseURL}/auth/api/calculator/services/category/editing`)
//       .then((res) => {
//         const filtered = filterOptionalServices(res.data.data);
//         setData(filtered);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   const filterOptionalServices = (services) => {
//     return services
//       .map((service) => {
//         const filteredCategories = service.categories
//           .map((category) => {
//             const filteredEditing = category.editing_types.filter((editing) => {
//               return !OPTIONAL_SERVICES.some(
//                 (opt) =>
//                   opt.service === service.service_name &&
//                   opt.category === category.category_name &&
//                   opt.editing_type === editing.editing_type_name
//               );
//             });
//             return { ...category, editing_types: filteredEditing };
//           })
//           .filter((cat) => cat.editing_types.length > 0);

//         return { ...service, categories: filteredCategories };
//       })
//       .filter((service) => service.categories.length > 0);
//   };

//   const selectedServiceData = data.find(
//     (s) => s.service_name === selectedService
//   );
//   const selectedCategoryData = selectedServiceData?.categories.find(
//     (c) => c.category_name === selectedCategory
//   );

//   useEffect(() => {
//     if (!selectedEditingType) return;

//     let totalAmount = selectedEditingType.amount * quantity;

//     OPTIONAL_SERVICES.forEach((opt) => {
//       if (optionalSelections[opt.key]) {
//         totalAmount += opt.amount;
//       }
//     });

//     setTotal(totalAmount);
//   }, [selectedEditingType, quantity, optionalSelections]);

//   const handleCheckboxChange = (key) => {
//     setOptionalSelections((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const handleSave = () => {
//     if (!selectedEditingType) return;

//     const payload = {
//       client_id: id,
//       service_name: selectedService,
//       category_name: selectedCategory,
//       editing_type_name: selectedEditingType.editing_type_name,
//       editing_type_amount: selectedEditingType.amount,
//       quantity,
//       total_amount: total,
//     };

//     // Add optional fields
//     OPTIONAL_SERVICES.forEach((opt) => {
//       payload[`include_${opt.key}`] = optionalSelections[opt.key] || false;
//     });

//     axios
//       .post(`${baseURL}/auth/api/calculator/saveCalculatorData`, payload)
//       .then((res) => {
//         if (res.data.status === "Success") {
//           Swal.fire({
//             icon: "success",
//             title: "Success",
//             text: "Saved Successfully!",
//           });
//         }
//       })
//       .catch((err) => {
//         console.error("Save error:", err);
//       });
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 space-y-4">
//       <h2 className="text-2xl font-bold text-gray-800">
//         🧮 Service Calculator
//       </h2>

//       <div>
//         <label className="block font-medium">Select Service</label>
//         <select
//           className="w-full p-2 border rounded"
//           value={selectedService}
//           onChange={(e) => {
//             setSelectedService(e.target.value);
//             setSelectedCategory("");
//             setSelectedEditingType(null);
//           }}
//         >
//           <option value="">-- Choose Service --</option>
//           {data.map((service) => (
//             <option key={service.service_id} value={service.service_name}>
//               {service.service_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedServiceData && (
//         <div>
//           <label className="block font-medium">Select Category</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedCategory}
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setSelectedEditingType(null);
//             }}
//           >
//             <option value="">-- Choose Category --</option>
//             {selectedServiceData.categories.map((category) => (
//               <option key={category.category_id} value={category.category_name}>
//                 {category.category_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {selectedCategoryData && (
//         <div>
//           <label className="block font-medium">Select Editing Type</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedEditingType?.editing_type_id || ""}
//             onChange={(e) => {
//               const edit = selectedCategoryData.editing_types.find(
//                 (et) => et.editing_type_id === parseInt(e.target.value)
//               );
//               setSelectedEditingType(edit);
//             }}
//           >
//             <option value="">-- Choose Editing Type --</option>
//             {selectedCategoryData.editing_types.map((edit) => (
//               <option key={edit.editing_type_id} value={edit.editing_type_id}>
//                 {edit.editing_type_name} - ₹{edit.amount}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       <div>
//         <label className="block font-medium">Quantity</label>
//         <input
//           type="number"
//           className="w-full p-2 border rounded"
//           min={1}
//           value={quantity}
//           onChange={(e) => setQuantity(parseInt(e.target.value))}
//         />
//       </div>

//       <div className="space-y-2">
//         {OPTIONAL_SERVICES.map((opt) => (
//           <div key={opt.key} className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               id={opt.key}
//               checked={optionalSelections[opt.key] || false}
//               onChange={() => handleCheckboxChange(opt.key)}
//             />
//             <label htmlFor={opt.key}>
//               {opt.label} (+₹{opt.amount})
//             </label>
//           </div>
//         ))}
//       </div>

//       <button
//         className="w-full bg-blue-600 text-white p-2 rounded mt-4"
//         onClick={handleSave}
//       >
//         Save & Calculate
//       </button>

//       {total > 0 && (
//         <div className="text-xl font-semibold text-center text-green-700 mt-4">
//           Total Amount: ₹{total}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCalculator;
