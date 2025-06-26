// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function Quotation() {
//   const baseURL = `http://localhost:5555`;
//   const { id, txn_id } = useParams();
//   console.log(id, txn_id);
//   const [serviceData, setServiceData] = useState([]);

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get(
//         `${baseURL}/auth/api/calculator/getClientServiceHistory/${id}/${txn_id}`
//       );
//       if (res.data.status === "Success") {
//         console.log(res.data.data);
//         setServiceData(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, [id, txn_id]);

//   console.log(serviceData);

//   const dummyGraphicData = [
//     {
//       service: "Graphic Design Service",
//       categories: [
//         {
//           categoryName: "Logo Design",
//           editingTypes: [
//             { type: "Basic Edit", quantity: 2, price: 1500 },
//             { type: "Advanced Edit", quantity: 1, price: 3000 },
//           ],
//         },
//         {
//           categoryName: "Banner Ads",
//           editingTypes: [{ type: "Simple Edit", quantity: 3, price: 1000 }],
//         },
//       ],
//     },
//   ];

//   const dummyAdsData = [
//     {
//       category: "Social Media",
//       amount: 5000,
//       percent: 10,
//       charges: 500,
//       finalTotal: 5500,
//     },
//     {
//       category: "Search Engine",
//       amount: 3000,
//       percent: 5,
//       charges: 150,
//       finalTotal: 3150,
//     },
//   ];

//   const [loading, setLoading] = useState(true);
//   const [graphicData, setGraphicData] = useState([]);
//   const [adsData, setAdsData] = useState([]);

//   useEffect(() => {
//     setTimeout(() => {
//       setGraphicData(dummyGraphicData);
//       setAdsData(dummyAdsData);
//       setLoading(false);
//     }, 500);
//   }, []);

//   if (loading)
//     return (
//       <div className="text-center p-10 font-semibold text-gray-700">
//         Loading...
//       </div>
//     );

//   const graphicTotal = graphicData.reduce((serviceSum, service) => {
//     return (
//       serviceSum +
//       service.categories.reduce((catSum, cat) => {
//         return (
//           catSum +
//           cat.editingTypes.reduce((editSum, edit) => {
//             return editSum + edit.price * edit.quantity;
//           }, 0)
//         );
//       }, 0)
//     );
//   }, 0);

//   const adsTotal = adsData.reduce((sum, item) => sum + item.finalTotal, 0);
//   const grandTotal = graphicTotal + adsTotal;

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="bg-white p-8 shadow-lg rounded-lg max-w-6xl w-full">
//         {/* Top Header with Client left and Company right */}
//         <div className="flex flex-col md:flex-row justify-between mb-8">
//           {/* Client Details - Left */}
//           <div className="md:w-1/2 mb-6 md:mb-0">
//             <h3 className="text-lg font-semibold border-b pb-2 mb-4">
//               Client Details
//             </h3>
//             <p>
//               <strong>Name:</strong> ABC Corporation
//             </p>
//             <p>
//               <strong>Contact:</strong> client@example.com
//             </p>
//             <p>
//               <strong>Address:</strong> 456 Client St, Client City
//             </p>
//           </div>

//           {/* Company Details & Quotation Info - Right */}
//           <div className="md:w-1/2 text-right">
//             <h1 className="text-3xl font-bold text-indigo-700 mb-1">
//               DOAGuru InfoSystems
//             </h1>
//             <p className="text-gray-600">
//               1815, Wright Town, Jabalpur, <br /> Madhya Pradesh 482002
//             </p>
//             <p className="text-gray-600 mb-4">Phone: 074409 92424</p>

//             <h2 className="text-xl font-semibold">Quotation</h2>
//             <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
//             <p className="text-gray-600">Quote #: QTN-2025-001</p>
//           </div>
//         </div>

//         {/* Graphic Section */}
//         <section className="mb-10">
//           <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-indigo-700">
//             Graphic & SEO Services
//           </h3>
//           {graphicData.map((service, idx) => (
//             <div key={idx} className="mb-6">
//               {/* <h4 className="font-semibold text-lg mb-4">{service.service}</h4> */}

//               {service.categories.map((cat, cidx) => (
//                 <div key={cidx} className="mb-4">
//                   <h5 className="font-semibold mb-2">{cat.categoryName}</h5>
//                   <table className="min-w-full border border-gray-300 rounded overflow-hidden text-sm">
//                     <thead className="bg-indigo-100">
//                       <tr>
//                         <th className="border px-3 py-2 text-left">
//                           Editing Type
//                         </th>
//                         <th className="border px-3 py-2 text-right">
//                           Quantity
//                         </th>
//                         <th className="border px-3 py-2 text-right">
//                           Price (₹)
//                         </th>
//                         <th className="border px-3 py-2 text-right">
//                           Total (₹)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {cat.editingTypes.map((edit, eidx) => (
//                         <tr
//                           key={eidx}
//                           className={eidx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                         >
//                           <td className="border px-3 py-2">{edit.type}</td>
//                           <td className="border px-3 py-2 text-right">
//                             {edit.quantity}
//                           </td>
//                           <td className="border px-3 py-2 text-right">
//                             {edit.price.toLocaleString()}
//                           </td>
//                           <td className="border px-3 py-2 text-right">
//                             {(edit.price * edit.quantity).toLocaleString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             </div>
//           ))}

//           <p className="font-semibold text-right text-lg mt-4">
//             Total: ₹{graphicTotal.toLocaleString()}
//           </p>
//         </section>

//         {/* Ads Section */}
//         <section className="mb-10">
//           <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
//             Ads Services
//           </h3>
//           <table className="min-w-full border border-gray-300 rounded overflow-hidden text-sm">
//             <thead className="bg-indigo-100">
//               <tr>
//                 <th className="border px-3 py-2 text-left">Category</th>
//                 <th className="border px-3 py-2 text-right">Amount (₹)</th>
//                 <th className="border px-3 py-2 text-right">Percentage (%)</th>
//                 <th className="border px-3 py-2 text-right">Charges (₹)</th>
//                 <th className="border px-3 py-2 text-right">Final Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {adsData.map((ad, idx) => (
//                 <tr
//                   key={idx}
//                   className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                 >
//                   <td className="border px-3 py-2">{ad.category}</td>
//                   <td className="border px-3 py-2 text-right">
//                     {ad.amount.toLocaleString()}
//                   </td>
//                   <td className="border px-3 py-2 text-right">{ad.percent}</td>
//                   <td className="border px-3 py-2 text-right">
//                     {ad.charges.toLocaleString()}
//                   </td>
//                   <td className="border px-3 py-2 text-right font-semibold">
//                     {ad.finalTotal.toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <p className="font-semibold text-right text-lg mt-4">
//             Ads Total: ₹{adsTotal.toLocaleString()}
//           </p>
//         </section>

//         {/* Grand Total */}
//         <section className="border-t pt-4 text-right">
//           <p className="text-2xl font-bold text-indigo-700">
//             Grand Total: ₹{grandTotal.toLocaleString()}
//           </p>
//         </section>

//         {/* Footer */}
//         <footer className="mt-10 border-t pt-6 text-center text-gray-600 text-sm">
//           <p>Thank you for your business!</p>
//           <p>Please contact us for any questions regarding this quotation.</p>
//         </footer>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Quotation() {
  const baseURL = `http://localhost:5555`;
  const { id, txn_id } = useParams();
  console.log(id, txn_id);

  const [serviceData, setServiceData] = useState([]);
  const [graphicData, setGraphicData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getClientServiceHistory/${id}/${txn_id}`
      );
      console.log(res);
      console.log(res.data);
      console.log(res.data.data);
      setServiceData(res.data.data);
      //   if (res.data.status === "Success") {
      //   }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(serviceData);

  // Process data into grouped structure
  useEffect(() => {
    fetchServices();
  }, [id, txn_id]);

  useEffect(() => {
    if (serviceData.length === 0) return;

    // Separate graphic and ads
    const graphicRaw = serviceData.filter(
      (item) => item.service_type === "Graphic Service"
    );
    const adsRaw = serviceData.filter(
      (item) => item.service_type === "Ads Campaign"
    );

    // Group Graphic by service_name -> category_name -> editing types
    const groupedGraphic = [];

    graphicRaw.forEach((item) => {
      // Find or create service
      let service = groupedGraphic.find((s) => s.service === item.service_name);
      if (!service) {
        service = { service: item.service_name, categories: [] };
        groupedGraphic.push(service);
      }

      // Find or create category
      let category = service.categories.find(
        (c) => c.categoryName === item.category_name
      );
      if (!category) {
        category = { categoryName: item.category_name, editingTypes: [] };
        service.categories.push(category);
      }

      // Add editing type
      category.editingTypes.push({
        type: item.editing_type_name || "N/A",
        quantity: Number(item.quantity) || 1,
        price: Number(item.editing_type_amount) || 0,
        total: Number(item.total_amount) || 0,
      });
    });

    setGraphicData(groupedGraphic);
    setAdsData(adsRaw);
    setLoading(false);
  }, [serviceData]);

  // Calculate totals
  const graphicTotal = graphicData.reduce((serviceSum, service) => {
    return (
      serviceSum +
      service.categories.reduce((catSum, cat) => {
        return (
          catSum +
          cat.editingTypes.reduce((editSum, edit) => {
            return editSum + (edit.total || edit.price * edit.quantity);
          }, 0)
        );
      }, 0)
    );
  }, 0);

  const adsTotal = adsData.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0
  );

  const grandTotal = graphicTotal + adsTotal;

  if (loading)
    return (
      <div className="text-center p-10 font-semibold text-gray-700">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-6xl w-full">
        {/* Top Header with Client left and Company right */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Client Details - Left */}
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Client Details
            </h3>
            {/* TODO: Replace static client info if available */}
            <p>
              <strong>Name:</strong> ABC Corporation
            </p>
            <p>
              <strong>Contact:</strong> client@example.com
            </p>
            <p>
              <strong>Address:</strong> 456 Client St, Client City
            </p>
          </div>

          {/* Company Details & Quotation Info - Right */}
          <div className="md:w-1/2 text-right">
            <h1 className="text-3xl font-bold text-indigo-700 mb-1">
              DOAGuru InfoSystems
            </h1>
            <p className="text-gray-600">
              1815, Wright Town, Jabalpur, <br /> Madhya Pradesh 482002
            </p>
            <p className="text-gray-600 mb-4">Phone: 074409 92424</p>

            <h2 className="text-xl font-semibold">Quotation</h2>
            <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">Quote #: {txn_id}</p>
          </div>
        </div>

        {/* Graphic Section */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-indigo-700">
            Graphic Services
          </h3>
          {graphicData.length === 0 && (
            <p className="text-center text-gray-500">
              No Graphic Services found.
            </p>
          )}
          {graphicData.map((service, idx) => (
            <div key={idx} className="mb-6">
              <h4 className="font-semibold text-lg mb-4">
                {service.service || "N/A"}
              </h4>

              {service.categories.map((cat, cidx) => (
                <div key={cidx} className="mb-4">
                  <h5 className="font-semibold mb-2">
                    {cat.categoryName || "N/A"}
                  </h5>
                  <table className="min-w-full border border-gray-300 rounded overflow-hidden text-sm">
                    <thead className="bg-indigo-100">
                      <tr>
                        <th className="border px-3 py-2 text-left">
                          Editing Type
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
                      {cat.editingTypes.map((edit, eidx) => (
                        <tr
                          key={eidx}
                          className={eidx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="border px-3 py-2">{edit.type}</td>
                          <td className="border px-3 py-2 text-right">
                            {edit.quantity}
                          </td>
                          <td className="border px-3 py-2 text-right">
                            {edit.price.toLocaleString()}
                          </td>
                          <td className="border px-3 py-2 text-right">
                            {edit.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}

          <p className="font-semibold text-right text-lg mt-4">
            Graphic Total: ₹{graphicTotal.toLocaleString()}
          </p>
        </section>

        {/* Ads Section */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
            Ads Services
          </h3>
          {adsData.length === 0 && (
            <p className="text-center text-gray-500">No Ads Services found.</p>
          )}
          {adsData.length > 0 && (
            <table className="min-w-full border border-gray-300 rounded overflow-hidden text-sm">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Category</th>
                  <th className="border px-3 py-2 text-right">Amount (₹)</th>
                  <th className="border px-3 py-2 text-right">
                    Percentage (%)
                  </th>
                  <th className="border px-3 py-2 text-right">Charges (₹)</th>
                  <th className="border px-3 py-2 text-right">
                    Final Total (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {adsData.map((ad, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border px-3 py-2">
                      {ad.category_name || "N/A"}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {Number(
                        ad.editing_type_amount || ad.amount || 0
                      ).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {ad.percent || ad.percentage || 0}
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {Number(ad.charge || 0).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      {Number(
                        ad.total_amount || ad.finalTotal || 0
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="font-semibold text-right text-lg mt-4">
            Ads Total: ₹{adsTotal.toLocaleString()}
          </p>
        </section>

        {/* Grand Total */}
        <section className="border-t pt-4 text-right">
          <p className="text-2xl font-bold text-indigo-700">
            Grand Total: ₹{grandTotal.toLocaleString()}
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t pt-6 text-center text-gray-600 text-sm">
          <p>Thank you for your business!</p>
          <p>Please contact us for any questions regarding this quotation.</p>
        </footer>
      </div>
    </div>
  );
}
