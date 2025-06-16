import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const OPTIONAL_SERVICES = [
  {
    service: "Social Media Optimization",
    category: "Organic Page Optimization",
    editing_type: "Content Posting",
    amount: 400,
  },
  {
    service: "Graphics Design",
    category: "Static Graphics",
    editing_type: "Thumbnail Creation",
    amount: 300,
  },
];

const AdminCalculator = () => {
  const baseURL = `http://localhost:5555`;
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEditingType, setSelectedEditingType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [includeContentPosting, setIncludeContentPosting] = useState(false);
  const [includeThumbnailCreation, setIncludeThumbnailCreation] =
    useState(false);

  const [total, setTotal] = useState(0);

  console.log(
    selectedService,
    selectedCategory,
    selectedEditingType,
    quantity,
    includeContentPosting,
    includeThumbnailCreation,
    total
  );

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

  // const handleCalculate = () => {
  //   if (!selectedEditingType) return;
  //   let baseAmount = selectedEditingType.amount * quantity;
  //   if (includeOptional) {
  //     baseAmount += OPTIONAL_SERVICES.reduce((sum, s) => sum + s.amount, 0);
  //   }
  //   setTotal(baseAmount);
  // };

  // const handleCalculate = () => {
  //   if (!selectedEditingType) return;

  //   let baseAmount = selectedEditingType.amount * quantity;

  //   if (includeContentPosting) {
  //     baseAmount += OPTIONAL_SERVICES[0].amount; // Content Posting
  //   }
  //   if (includeThumbnailCreation) {
  //     baseAmount += OPTIONAL_SERVICES[1].amount; // Thumbnail Creation
  //   }

  //   setTotal(baseAmount);
  // };

  const getSelectedService = data.find(
    (s) => s.service_name === selectedService
  );
  const getSelectedCategory = getSelectedService?.categories.find(
    (c) => c.category_name === selectedCategory
  );

  const handleSave = () => {
    if (!selectedEditingType) return;

    let baseAmount = selectedEditingType.amount * quantity;

    if (includeContentPosting) {
      baseAmount += OPTIONAL_SERVICES[0].amount; // Content Posting
    }
    if (includeThumbnailCreation) {
      baseAmount += OPTIONAL_SERVICES[1].amount; // Thumbnail Creation
    }

    setTotal(baseAmount);

    const payload = {
      service_name: selectedService,
      category_name: selectedCategory,
      editing_type_name: selectedEditingType.editing_type_name,
      editing_type_amount: selectedEditingType.amount,
      quantity,
      include_content_posting: includeContentPosting,
      include_thumbnail_creation: includeThumbnailCreation,
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
    <>
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          🧮 Service Calculator
        </h2>

        <div>
          <label className="block font-medium">Select Service</label>
          <select
            className="w-full p-2 border rounded"
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
            <label className="block font-medium">Select Category</label>
            <select
              className="w-full p-2 border rounded"
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
            <label className="block font-medium">Select Editing Type</label>
            <select
              className="w-full p-2 border rounded"
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
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">
              Include Content Posting?
            </label>
            <div className="flex gap-4 mt-2">
              <button
                className={`px-4 py-2 rounded ${
                  includeContentPosting
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setIncludeContentPosting(true)}
              >
                YES
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  !includeContentPosting
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setIncludeContentPosting(false)}
              >
                NO
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium">
              Include Thumbnail Creation?
            </label>
            <div className="flex gap-4 mt-2">
              <button
                className={`px-4 py-2 rounded ${
                  includeThumbnailCreation
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setIncludeThumbnailCreation(true)}
              >
                YES
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  !includeThumbnailCreation
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setIncludeThumbnailCreation(false)}
              >
                NO
              </button>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white p-2 rounded mt-4"
          onClick={handleSave}
        >
          Calculate Total
        </button>

        {total > 0 && (
          <div className="text-xl font-semibold text-center text-green-700 mt-4">
            Total Amount: ₹{total}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCalculator;
