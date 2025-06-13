// import React, { useState } from "react";

// const services = [
//   {
//     name: "Video Services",
//     categories: [
//       {
//         title: "Reels (up to 30 sec)",
//         options: [
//           { type: "Basic Editing", price: 500 },
//           { type: "Standard Editing", price: 800 },
//           { type: "Advanced Editing (VFX)", price: 1200 },
//         ],
//       },
//       {
//         title: "Premium Video (31 sec - 2 min)",
//         options: [
//           { type: "Basic Editing", price: 800 },
//           { type: "Standard Editing", price: 1200 },
//           { type: "Advanced Editing (VFX)", price: 1800 },
//         ],
//       },
//       {
//         title: "Shorts (up to 10 sec)",
//         options: [
//           { type: "Basic Editing", price: 300 },
//           { type: "Standard Editing", price: 500 },
//           { type: "Advanced Editing (VFX)", price: 700 },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Graphics Design",
//     categories: [
//       { title: "Banner/Poster Design", price: 200 },
//       { title: "Carousel", price: 300 },
//     ],
//   },
//   {
//     name: "Video Shoot",
//     categories: [
//       { title: "Camera Shoot (15 min - 1 Hr)", price: 1000 },
//       { title: "Mobile Shoot (15 min - 1 Hr)", price: 600 },
//     ],
//   },
//   {
//     name: "Ad Budget",
//     categories: [
//       { title: "Meta Ad Budget", price: 0 },
//       { title: "Google Ad Budget", price: 0 },
//     ],
//   },
//   {
//     name: "SEO",
//     categories: [{ title: "Lead Generation SEO", price: 1500 }],
//   },
//   {
//     name: "GMB",
//     categories: [{ title: "LOCAL SEO", price: 1000 }],
//   },
// ];

// const AdminCalculator = () => {
//   const [quantities, setQuantities] = useState({});

//   const handleQuantityChange = (key, value) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [key]: Number(value),
//     }));
//   };

//   const getTotal = () => {
//     let total = 0;
//     Object.keys(quantities).forEach((key) => {
//       const [price] = key.split("_").slice(-1);
//       const qty = quantities[key];
//       total += parseFloat(price) * qty;
//     });
//     return total;
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Service Budget Calculator
//       </h1>
//       {services.map((service, i) => (
//         <div key={i} className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-semibold text-blue-700 mb-2">
//             {service.name}
//           </h2>
//           {service.categories.map((cat, j) => (
//             <div key={j} className="ml-4 mb-4">
//               <h3 className="font-semibold text-lg text-gray-700">
//                 {cat.title}
//               </h3>
//               {"options" in cat ? (
//                 cat.options.map((opt, k) => {
//                   const key = `${cat.title}_${opt.type}_${opt.price}`;
//                   return (
//                     <div key={k} className="flex items-center gap-4 ml-4 mt-2">
//                       <span className="w-64">{opt.type}</span>
//                       <span className="w-24">₹{opt.price}</span>
//                       <input
//                         type="number"
//                         min="0"
//                         className="border rounded px-2 py-1 w-24"
//                         value={quantities[key] || ""}
//                         onChange={(e) =>
//                           handleQuantityChange(key, e.target.value)
//                         }
//                         placeholder="Qty"
//                       />
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="flex items-center gap-4 ml-4 mt-2">
//                   <span className="w-64">{cat.title}</span>
//                   <span className="w-24">₹{cat.price}</span>
//                   <input
//                     type="number"
//                     min="0"
//                     className="border rounded px-2 py-1 w-24"
//                     value={quantities[`${cat.title}_${cat.price}`] || ""}
//                     onChange={(e) =>
//                       handleQuantityChange(
//                         `${cat.title}_${cat.price}`,
//                         e.target.value
//                       )
//                     }
//                     placeholder="Qty"
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ))}

//       <div className="mt-10 text-2xl font-bold text-right">
//         Total Budget: ₹{getTotal()}
//       </div>
//     </div>
//   );
// };

// export default AdminCalculator;
// ========================================================================================================

// CORRECT CODE FINE CODE

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminCalculator = () => {
//   const [structuredData, setStructuredData] = useState({});
//   const [quantities, setQuantities] = useState({});
//   const [openService, setOpenService] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5555/auth/api/calculator/api/services/details/all")
//       .then((res) => {
//         const raw = res.data.data;
//         const structured = {};

//         raw.forEach((item) => {
//           const { service_name, category_name, editing_type_name, amount } =
//             item;

//           // 👇 FILTERING LOGIC
//           if (service_name === "Social Media Optimization") return;

//           if (
//             service_name === "Graphics Design" &&
//             category_name === "Static Graphics" &&
//             editing_type_name === "Thumbnail Creation"
//           ) {
//             return;
//           }

//           if (!structured[service_name]) structured[service_name] = {};
//           if (!structured[service_name][category_name])
//             structured[service_name][category_name] = [];

//           structured[service_name][category_name].push({
//             editing_type_name,
//             amount: parseFloat(amount),
//           });
//         });

//         setStructuredData(structured);
//       });
//   }, []);

//   const handleChange = (key, qty) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [key]: Number(qty),
//     }));
//   };

//   const calculateTotal = () => {
//     return Object.entries(quantities).reduce((acc, [key, qty]) => {
//       const amount = parseFloat(key.split("_").pop());
//       return acc + qty * amount;
//     }, 0);
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         📋 Service Budget Calculator
//       </h2>

//       <div className="space-y-4">
//         {Object.entries(structuredData).map(([serviceName, categories]) => (
//           <div key={serviceName} className="bg-white shadow rounded">
//             <button
//               onClick={() =>
//                 setOpenService(openService === serviceName ? null : serviceName)
//               }
//               className="w-full text-left px-4 py-3 font-semibold text-lg bg-blue-100 hover:bg-blue-200 rounded-t"
//             >
//               {serviceName}
//             </button>

//             {openService === serviceName && (
//               <div className="p-4 space-y-4">
//                 {Object.entries(categories).map(
//                   ([categoryName, editingTypes]) => (
//                     <div key={categoryName}>
//                       <h4 className="font-semibold text-gray-700 mb-2">
//                         {categoryName}
//                       </h4>
//                       {editingTypes.map((et, idx) => {
//                         const key = `${serviceName}_${categoryName}_${et.editing_type_name}_${et.amount}`;
//                         return (
//                           <div
//                             key={idx}
//                             className="flex items-center gap-4 mb-2 ml-4"
//                           >
//                             <span className="w-64">{et.editing_type_name}</span>
//                             <span className="w-24 text-green-600 font-medium">
//                               ₹{et.amount}
//                             </span>
//                             <input
//                               type="number"
//                               min="0"
//                               className="border px-2 py-1 w-24 rounded"
//                               placeholder="Qty"
//                               value={quantities[key] || ""}
//                               onChange={(e) =>
//                                 handleChange(key, e.target.value)
//                               }
//                             />
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="text-right text-2xl font-bold mt-8">
//         Total Budget: ₹{calculateTotal()}
//       </div>
//     </div>
//   );
// };

// export default AdminCalculator;

// *********************************************************************************************************

// CORRECT CODE FINE CODE

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminCalculator = () => {
//   const [structuredData, setStructuredData] = useState({});
//   const [quantities, setQuantities] = useState({});

//   useEffect(() => {
//     axios
//       .get("http://localhost:5555/auth/api/calculator/api/services/details/all")
//       .then((res) => {
//         const raw = res.data.data;
//         const structured = {};

//         raw.forEach((item) => {
//           const { service_name, category_name, editing_type_name, amount } =
//             item;

//           if (!structured[service_name]) structured[service_name] = {};
//           if (!structured[service_name][category_name])
//             structured[service_name][category_name] = [];

//           structured[service_name][category_name].push({
//             editing_type_name,
//             amount: parseFloat(amount),
//           });
//         });

//         setStructuredData(structured);
//       });
//   }, []);

//   const handleChange = (key, qty) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [key]: Number(qty),
//     }));
//   };

//   const calculateTotal = () => {
//     return Object.entries(quantities).reduce((acc, [key, qty]) => {
//       const amount = parseFloat(key.split("_").pop());
//       return acc + qty * amount;
//     }, 0);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         Service Budget Calculator
//       </h2>

//       {Object.entries(structuredData).map(([serviceName, categories]) => (
//         <div key={serviceName} className="mb-8 border-b pb-4">
//           <h3 className="text-2xl font-semibold text-blue-700 mb-2">
//             {serviceName}
//           </h3>
//           {Object.entries(categories).map(([categoryName, editingTypes]) => (
//             <div key={categoryName} className="ml-4 mb-4">
//               <h4 className="font-semibold text-lg text-gray-800">
//                 {categoryName}
//               </h4>
//               {editingTypes.map((et, idx) => {
//                 const key = `${serviceName}_${categoryName}_${et.editing_type_name}_${et.amount}`;
//                 return (
//                   <div key={idx} className="flex items-center gap-4 ml-4 mt-2">
//                     <span className="w-64">{et.editing_type_name}</span>
//                     <span className="w-24">₹{et.amount}</span>
//                     <input
//                       type="number"
//                       min="0"
//                       className="border px-2 py-1 w-24 rounded"
//                       placeholder="Qty"
//                       value={quantities[key] || ""}
//                       onChange={(e) => handleChange(key, e.target.value)}
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       ))}

//       <div className="text-right text-2xl font-bold mt-10">
//         Total Budget: ₹{calculateTotal()}
//       </div>
//     </div>
//   );
// };

// export default AdminCalculator;

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCalculator = () => {
  const [structuredData, setStructuredData] = useState({});
  const [quantities, setQuantities] = useState({});
  const [openService, setOpenService] = useState(null);

  // Ads Budget
  const [adsData, setAdsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [adsResult, setAdsResult] = useState(null);

  // Fetch Services
  useEffect(() => {
    axios
      .get("http://localhost:5555/auth/api/calculator/api/services/details/all")
      .then((res) => {
        const raw = res.data.data;
        const structured = {};

        raw.forEach((item) => {
          const { service_name, category_name, editing_type_name, amount } =
            item;

          if (service_name === "Social Media Optimization") return;

          if (
            service_name === "Graphics Design" &&
            category_name === "Static Graphics" &&
            editing_type_name === "Thumbnail Creation"
          ) {
            return;
          }

          if (!structured[service_name]) structured[service_name] = {};
          if (!structured[service_name][category_name])
            structured[service_name][category_name] = [];

          structured[service_name][category_name].push({
            editing_type_name,
            amount: parseFloat(amount),
          });
        });

        setStructuredData(structured);
      });

    // Fetch Ads Budget Ranges
    axios
      .get("http://localhost:5555/auth/api/calculator/getAdsServices")
      .then((res) => {
        setAdsData(res.data.data);
      });
  }, []);

  const handleChange = (key, qty) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Number(qty),
    }));
  };

  const calculateTotal = () => {
    return Object.entries(quantities).reduce((acc, [key, qty]) => {
      const amount = parseFloat(key.split("_").pop());
      return acc + qty * amount;
    }, 0);
  };

  const calculateAdsCost = () => {
    if (!enteredAmount || !selectedCategory) {
      setAdsResult(null);
      return;
    }

    const amount = parseFloat(enteredAmount);
    const matched = adsData
      .filter((ad) => ad.ads_category === selectedCategory)
      .find((range) => {
        const start = parseInt(range.amt_range_start);
        const end =
          range.amt_range_end === "Above"
            ? Infinity
            : parseInt(range.amt_range_end);
        return amount >= start && amount <= end;
      });

    if (matched) {
      const percent = parseFloat(matched.percentage);
      const charge = (amount * percent) / 100;
      const total = amount + charge;

      setAdsResult({
        percent,
        charge,
        total,
        entered: amount,
      });
    } else {
      setAdsResult(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        📋 Service Budget Calculator
      </h2>

      {/* Service Section */}
      <div className="space-y-4">
        {Object.entries(structuredData).map(([serviceName, categories]) => (
          <div key={serviceName} className="bg-white shadow rounded">
            <button
              onClick={() =>
                setOpenService(openService === serviceName ? null : serviceName)
              }
              className="w-full text-left px-4 py-3 font-semibold text-lg bg-blue-100 hover:bg-blue-200 rounded-t"
            >
              {serviceName}
            </button>

            {openService === serviceName && (
              <div className="p-4 space-y-4">
                {Object.entries(categories).map(
                  ([categoryName, editingTypes]) => (
                    <div key={categoryName}>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        {categoryName}
                      </h4>
                      {editingTypes.map((et, idx) => {
                        const key = `${serviceName}_${categoryName}_${et.editing_type_name}_${et.amount}`;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-4 mb-2 ml-4"
                          >
                            <span className="w-64">{et.editing_type_name}</span>
                            <span className="w-24 text-green-600 font-medium">
                              ₹{et.amount}
                            </span>
                            <input
                              type="number"
                              min="0"
                              className="border px-2 py-1 w-24 rounded"
                              placeholder="Qty"
                              value={quantities[key] || ""}
                              onChange={(e) =>
                                handleChange(key, e.target.value)
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ads Campaign Section */}
      <div className="mt-10 bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-semibold mb-4">📢 Ads Campaign Budget</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/2"
          >
            <option value="">-- Select Ads Category --</option>
            {[...new Set(adsData.map((item) => item.ads_category))].map(
              (cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              )
            )}
          </select>

          <input
            type="number"
            placeholder="Enter Budget Amount"
            value={enteredAmount}
            onChange={(e) => setEnteredAmount(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/2"
          />
        </div>

        <button
          onClick={calculateAdsCost}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Calculate Ads Budget
        </button>

        {adsResult && (
          <div className="mt-4 border-t pt-4 text-lg space-y-1">
            <p>📊 Percentage: {adsResult.percent}%</p>
            <p>💼 Entered Amount: ₹{adsResult.entered}</p>
            <p>💸 Agency Charge: ₹{adsResult.charge}</p>
            <p className="font-bold text-green-700 text-xl mt-2">
              🧾 Total Ads Cost: ₹{adsResult.total}
            </p>
          </div>
        )}
      </div>

      {/* Final Total */}
      <div className="text-right text-2xl font-bold mt-8">
        Total Services: ₹{calculateTotal()}
        <br />
        Total Ads Budget: ₹{adsResult?.total || 0}
        <br />
        <span className="text-blue-800">
          Grand Total: ₹{calculateTotal() + (adsResult?.total || 0)}
        </span>
      </div>
    </div>
  );
};

export default AdminCalculator;
