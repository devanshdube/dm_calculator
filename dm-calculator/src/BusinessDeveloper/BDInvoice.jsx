import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, Search, ArrowLeft, X, User, Building, Mail, Phone, MapPin, Timer, Calendar1, Trash, RefreshCcw } from "lucide-react";

import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { clearUser } from "../redux/user/userSlice";
import img1 from "../assets/Dg 1copy.png";
import img2 from "../assets/Dg 2copy.png";
import img3 from "../assets/DOAGURU IT Solution.png";
import img4 from "../assets/DOAGURU Infosystyem.png";
import img5 from "../assets/dghead.jpeg";

export default function BDInvoice() {
  const baseURL = `https://dmcalculator.dentalguru.software`;
  const { id, txn_id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isGST = query.get("gst") === "1";
  const navigate = useNavigate();
const { currentUser, token } = useSelector((state) => state.user);
  const userName = currentUser?.name;
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);

  const [serviceData, setServiceData] = useState([]);
  const [additionalServiceData, setAdditionalServiceData] = useState([]);
  const [remainingAmountData, setRemainingAmountData] = useState([]);
  const [graphicData, setGraphicData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [complimentaryData, setComplimentaryData] = useState([]);
  const [selecteddiscount, setSelecteddiscount] = useState("");
  const [selectedBudget, setSelectedBudgest] = useState(0);
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({
    header: false,
    footer: false,
  });
  const [selectedService, setSelectedService] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedEditingType, setSelectedEditingType] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [getData, setGetData] = useState([]);
    const [optionalServices, setOptionalServices] = useState([]);
    const [data, setData] = useState([]);
  
    const [addons, setAddons] = useState({});
    const [isEditingAddition, setIsEditingAddition] = useState(false);
    const [showModalAddition, setShowModalAddition] = useState(false);
    const [showModalRemaining, setShowModalRemaining] = useState(false);
    const [isEditingRemaining, setIsEditingRemaining] = useState(false);

    const [optionalAmounts, setOptionalAmounts] = useState([]);

    const [showModalInvoiceClient, setShowModalInvoiceClient] = useState(false);
      const [formData, setFormData] = useState({

      created_at:"",
      duration_start_date: "",
      duration_end_date:"",
      payment_mode:"",
      client_gst_no:"",
      client_pan_no:"",
      tag_received_amt:"",

    });
      const [formDataRemaining, setFormDataRemaining] = useState({

      service_name: "",
 price: "",

    });
  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getinInvoiceServiceHistory/${id}/${txn_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServiceData(res.data.data);
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

  const fetchClient = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getInvoiceClientDetailsById/${id}/${txn_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        setClientData(res.data.data);
      }
      console.log(clientData);
      
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
  const fetchComplimentaryData = async () => {
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
      setComplimentaryData(data.data);
      console.log(complimentaryData);
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
  const fetchDiscount = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getByIDDiscountData/${id}/${txn_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelecteddiscount(data.data[0].discount_per);
    } catch (error) {
      console.error(error);
    }
  };
  // const fetchPredefinedNotes = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${baseURL}/auth/api/calculator/getInvoiceNoteData`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setPredefinedNotes(data.data || []);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchAdditionservice = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getAdditionByIdData/${id}/${txn_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        setAdditionalServiceData(res.data.data);
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
  const fetchRemainingAmount = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/auth/api/calculator/getRemainingAmountByIdData/${id}/${txn_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "Success") {
        setRemainingAmountData(res.data.data);
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



  const clientName = clientData?.client_name;
  const clientOrganization = clientData?.client_organization;
  const clientAddress = clientData?.address;
  const clientPhone = clientData?.phone;

  useEffect(() => {
    fetchServices();
    fetchClient();
    fetchClientNotes();
    fetchComplimentaryData();
    fetchDiscount();
    fetchAdditionservice();
    fetchRemainingAmount();
  }, [id, txn_id]);


    const handleEdit = (entry) => {
    setIsEditingAddition(entry.id);
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
       setShowModalAddition(true);
  };

    const getSelectedService = data.find(
    (s) => s.service_name === selectedService
  );
  const getSelectedCategory = getSelectedService?.categories.find(
    (c) => c.category_name === selectedCategory
  );



  const handleShow = () => {
    
    setIsEditingAddition(false);
    setShowModalAddition(true);
  };
  const handleRemainingShow = () => {
    
    setIsEditingRemaining(false);
    setShowModalRemaining(true);
  };

useEffect(() => {
  if (!Array.isArray(serviceData) || serviceData.length === 0) return;

  const graphicRaw = serviceData.filter(
    (item) => item.service_type === "Graphic Service"
  );
  const adsRaw = serviceData.filter(
    (item) => item.service_type === "Ads Campaign"
  );

  const groupedGraphic = [];

  graphicRaw.forEach((item) => {
    let service = groupedGraphic.find((s) => s.service === item.service_name);
    if (!service) {
      service = { service: item.service_name, editingTypes: [] };
      groupedGraphic.push(service);
    }

    service.editingTypes.push({
      category: item.category_name,
      type: item.editing_type_name || "N/A",
      quantity: Number(item.quantity) || 1,
      price: Number(item.editing_type_amount) || 0,
      include_content_posting: Number(item.include_content_posting) || 0,
      include_thumbnail_creation: Number(item.include_thumbnail_creation) || 0,
      total: Number(item.total_amount) || 0,
    });
  });

  setGraphicData(groupedGraphic);
  setAdsData(adsRaw);
  setLoading(false);
}, [serviceData]);

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

 const handleSave = (e) => {
     e.preventDefault();
    if (!selectedEditingType) return;
   

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
      txn_id: txn_id,
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

    const request = isEditingAddition
      ? axios.put(
          `${baseURL}/auth/api/calculator/updateAdditionalDataById/${isEditingAddition}`,
          payload
        )
      : axios.post(
          `${baseURL}/auth/api/calculator/saveAdditionalData`,
          payload
        );

    request
      .then((res) => {
        resetForm();
        if (res.data.status === "Success") {
          Swal.fire({
            icon: "success",
            title: isEditingAddition ? "Updated!" : "Saved!",
            text: isEditingAddition ? "Entry updated successfully" : "Saved successfully",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          fetchAdditionservice();
            setShowModalAddition(false);
        
        }
      })
      .catch((err) => {
     
        console.error("Save error:", err);
      });
  };


  const handleShowClientInvoice =  () => {
        setFormData({
      created_at: moment(clientData.created_at).format("YYYY-MM-DD"),
      duration_start_date:clientData?.duration_start_date,
      duration_end_date:clientData?.duration_end_date,
      payment_mode:clientData?.payment_mode,
      client_gst_no:clientData?.client_gst_no,
      client_pan_no:clientData?.client_pan_no,
    })
    setShowModalInvoiceClient(true);
  };
  const handleEditRemaining =  (items) => {
    setIsEditingRemaining(items.id)
        setFormDataRemaining({
            service_name: items.service_name,
      price: items.price,
    })
    setShowModalRemaining(true);
  };

   const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const handleChangeRemaining = (e) => {
    const { name, value } = e.target;

    setFormDataRemaining((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditInvoice = async (e) => {
      e.preventDefault();
    try {
      // ✅ Get fresh services
     
        const clientDetail = {
         created_at:formData?.created_at,
           duration_start_date: formData?.duration_start_date ,
        duration_end_date:formData?.duration_end_date ,
        payment_mode:formData?.payment_mode ,
        client_gst_no:formData?.client_gst_no ,
        client_pan_no:formData?.client_pan_no,
        tag_received_amt:formData?.tag_received_amt
        };

    

      const payload = {...clientDetail};
      await axios.put(`${baseURL}/auth/api/calculator/updateInvoiceClientDataById/${clientData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
    
      Swal.fire({
        icon: "success",
        title: "Invoice Updated",
        text: "Invoice Update successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      fetchClient()
      setShowModalInvoiceClient(false);
  
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating the invoice.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

   const handleRemainingSave = (e) => {
     e.preventDefault();
    
 

    const payload = {
      txn_id: txn_id,
      client_id: id,
      service_name: formDataRemaining.service_name,
      price: formDataRemaining.price,
      employee: userName,
    };

    const request = isEditingRemaining
      ? axios.put(
          `${baseURL}/auth/api/calculator/updateRemainingDataById/${isEditingRemaining}`,
          payload
        )
      : axios.post(
          `${baseURL}/auth/api/calculator/saveRemainingAmountData`,
          payload
        );

    request
      .then((res) => {
        resetForm();
        if (res.data.status === "Success") {
          Swal.fire({
            icon: "success",
            title: isEditingAddition ? "Updated!" : "Saved!",
            text: isEditingAddition ? "Entry updated successfully" : "Saved successfully",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          fetchRemainingAmount();
            setShowModalRemaining(false);
        
        }
      })
      .catch((err) => {
     
        console.error("Save error:", err);
      });
  };
  console.log(graphicData);

  const graphicTotal = graphicData.reduce(
    (sum, service) =>
      sum +
      service.editingTypes.reduce(
        (editSum, edit) => editSum + (edit.total || edit.price * edit.quantity),
        0
      ),
    0
  );
  const complimentaryTotal = complimentaryData.reduce((sum, service) => {
    // prefer total_amount if available, otherwise editing_type_amount * quantity
    const amount =
      service.total_amount !== null && service.total_amount !== undefined
        ? Number(service.total_amount)
        : Number(service.editing_type_amount || 0) *
          Number(service.quantity || 0);

    return sum + amount;
  }, 0);
  const additionalTotal = additionalServiceData.reduce((sum, service) => {
    // prefer total_amount if available, otherwise editing_type_amount * quantity
    const amount =
      service.total_amount !== null && service.total_amount !== undefined
        ? Number(service.total_amount)
        : Number(service.editing_type_amount || 0) *
          Number(service.quantity || 0);

    return sum + amount;
  }, 0);
  const remainingTotalAmount = remainingAmountData.reduce(
  (sum, item) => sum + (parseFloat(item.price) || 0),
  0
);
console.log(remainingAmountData);




  const adsTotal = adsData.reduce((sum, ad) => {
    const amount = Number(ad.amount || 0);
    const totalBudget = Number(ad.total_amount || 0);
    const gstTotal = (amount * 18) / 100;
    return sum + totalBudget + gstTotal;
  }, 0);
  const adsTotalBudget = adsData.reduce((sum, ad) => {
    const amount = Number(ad.amount || 0);

    const gstTotal = (amount * 18) / 100;
    return sum + amount + gstTotal;
  }, 0);
  const grandTotalAds = graphicTotal + adsTotal + additionalTotal - adsTotalBudget;

  const grandTotal = graphicTotal + adsTotal + additionalTotal + remainingTotalAmount;

  // Apply discount percentage only for display
  const discountAmount = selecteddiscount
    ? (grandTotalAds * Number(selecteddiscount)) / 100
    : 0;

  const gstexculidingAdsgst = grandTotalAds - discountAmount;
  console.log(gstexculidingAdsgst);

  const totalAfterDiscount = grandTotal - discountAmount;

  // If GST applies on discounted total
  const gstAmount = isGST ? gstexculidingAdsgst * 0.18 : 0;
  console.log(gstAmount);

  const finalTotal = totalAfterDiscount + gstAmount;

  if (loading) {
    return (
      <div className="text-center p-10 font-semibold text-gray-700">
        Loading...
      </div>
    );
  }
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
          `${baseURL}/auth/api/calculator/deleteAdditionalById/${entryId}`
        );
  
        const result = res.data;
  
        if (result.status === "Success") {
          setAdditionalServiceData((prev) => prev.filter((item) => item.id !== entryId));
  
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Entry has been deleted.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
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
   const handleRemainingDelete = async (entryId) => {
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
          `${baseURL}/auth/api/calculator/deleteRemainingAmountById/${entryId}`
        );
  
        const result = res.data;
  
        if (result.status === "Success") {
          setRemainingAmountData((prev) => prev.filter((item) => item.id !== entryId));
  
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Entry has been deleted.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
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
   const handleCloseInvoiceClient = () => {
    setShowModalInvoiceClient(false);
    setFormData({
     
      created_at:"",
      duration_start_date: "",
      duration_end_date:"",
      payment_mode:"",
      client_gst_no:"",
      client_pan_no:"",
      tag_received_amt:"",
    })

    
  };
   const handleClosesetRemaining = () => {
    setShowModalRemaining(false);
    setFormDataRemaining({
     service_name: "",
     price: "",
    })

    
  };
   const handleCloseAddition = () => {
    setShowModalAddition(false);
  };
    const resetForm = () => {
    // setIsEditingAddition(null);
    setSelectedService("");
    setSelectedCategory("");
    // setSelectedEditingType(null);
    setQuantity(1);
    const initialAddons = {};
    optionalServices.forEach((item) => {
      const key = item.editing_type_name.toLowerCase().replace(/\s+/g, "_");
      initialAddons[key] = false;
    });
    setAddons(initialAddons);

    setTotal(0);
  };

  const handlePrintPage = () => {
    document.title = clientOrganization ? `${clientOrganization} Invoice` :`${clientName} Invoice`;
    window.print();
  };
  return (
    <Wrapper>
      <div className="page-wrapper w-[210mm] h-[297mm] flex flex-col justify-between p-4  mx-auto bg-white print:break-after-page">
        {/* Hidden on print - Action Buttons */}

        <div className="print:hidden flex justify-end gap-3 my-4">
          <button
            onClick={handlePrintPage}
            className="bg-blue-600 text-white rounded-full px-4 py-2"
          >
            🖨️ Print
          </button>
            {clientData.tag_received_amt === "received" ? (
                    null
                  ): (
          <button
            onClick={() => navigate(`/BD/invoice-edit/${id}/${txn_id}`)}
            className="bg-orange-600 text-white rounded-full px-4 py-2"
          >
            ✏️ Edit
          </button>
                  )}
          <button
            onClick={() => navigate("/BD/dashboard")}
            className="bg-teal-600 text-white rounded-full px-4 py-2"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white rounded-full px-4 py-2"
          >
            🔙 Back
          </button>
        </div>

        {/* Table for proper header/footer repetition */}
        <table className="print:table print:border-collapse w-full">
          {/* Repeating Header */}
          <thead className="print:table-header-group w-full">
            <tr>
              <td className="p-0 m-0 w-full">
                <div className="w-full h-auto">
                  {isGST ? (
                    <img
                      src={img1}
                      alt="Header"
                      className="w-full h-full object-cover mb-4" // use object-cover for full width fitting
                    />
                  ) : (
                    <img
                      src={img5}
                      alt="Header"
                      className="w-full h-full object-cover mb-4" // use object-cover for full width fitting
                    />
                  )}
                </div>
              </td>
            </tr>
          </thead>

          {/* Repeating Footer */}

          {/* Main Content */}
          <tbody className="print:table-row-group">
            <tr>
              <td className="p-0 m-0 align-top">
                <div className="flex flex-col justify-between h-full px-6 py-4 print:px-4 ">
                   {clientData.tag_received_amt === "received" ? (
                  
                 null
                  ): (

                  <div className=" text-end print:hidden">

                    <button
                  onClick={handleShowClientInvoice}
                  className="px-4 mb-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                >
                   Edit
                </button>
                  </div>
                   )}
                  <div className="flex-grow">
                    {/* Client Details */}
                    <div className=" flex justify-between">
                      <div className="">
                      
                        <p>
                          <strong>Payment Mode : </strong>{" "}
                          {clientData?.payment_mode}
                        </p>
                         <p>
                          <strong>Service From : </strong>
                          {moment(clientData?.duration_start_date).format(
                            "DD/MM/YYYY"
                          )}{" "}
                          to{" "}
                          {moment(clientData?.duration_end_date).format(
                            "DD/MM/YYYY"
                          )}{" "}
                        </p>
                      </div>

                      <div className="">
                          <p className=" ">
                            <strong>Invoice No : </strong>{clientData.id}
                        </p>
                        <p className="mb-1">
                            <strong>Date :</strong>{" "}
                          {moment(clientData.created_at).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Client Info */}
                      <div className="border p-4 rounded-lg">
                        <h3 className="text-sm font-bold mb-2">BILL TO</h3>
                        <p>
                          <strong>Name :</strong> {clientData?.client_name}
                        </p>
                        {clientData.client_organization ? (
                          <>
                            <p>
                              <strong>Organization :</strong>{" "}
                              {clientData?.client_organization}
                            </p>
                          </>
                        )  : null}
                         <p>
                          <strong>Contact :</strong> {clientData?.phone}
                        </p>

                        
                        {clientData.client_gst_no ? (
                          <>
                            <p>
                              <strong>Gst No :</strong> {clientData?.client_gst_no}
                            </p>
                          </>
                        )  : null}
                        {clientData.client_pan_no ? (
                          <>
                            <p>
                              <strong>Pan No :</strong> {clientData?.client_pan_no}
                            </p>
                          </>
                        )  : null}
{clientData.address ? (
                          <>
                            <p>
                              <strong>Address :</strong> {clientData?.address}
                            </p>
                          </>
                        )  : null}
                       
                       
                      </div>

                      {/* Company Info */}
                      <div className="border p-4 rounded-lg">
                        <h3 className="text-sm font-bold mb-2">FROM</h3>
                        <p>
                          <strong>Company :</strong> DOAGuru Infosystems
                        </p>
                        <p>
                          <strong>Email :</strong> info@doaguru.com
                        </p>
               
                        <p>
                          <strong>Phone :</strong> +91 74409 92424
                        </p>
                                 <p>
                          <strong>GST No :</strong> 23AGLPP2890G1Z7
                        </p>
                        <p>
                          <strong>Address :</strong> 1815, Wright Town, Jabalpur
                        </p>
                      </div>
                    </div>
                    {/* Graphic Services */}
                    {graphicData.length > 0 && (
                      <section className="mb-2">
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">
                          Graphic Services
                        </h3>

                        {graphicData.map((service, idx) => (
                          <div key={idx} className="mb-6">
                            <h4 className="font-semibold text-lg mb-2">
                              {service.service}
                            </h4>

                            <table className="w-full border text-sm">
                              <thead className="bg-indigo-100">
                                <tr>
                                  <th className="border px-3 py-2 text-left">
                                    Category
                                  </th>
                                  <th className="border px-3 py-2 text-left">
                                    Creative Type
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
                                {service.editingTypes.map((edit, eidx) => {
                                  const qty = edit.quantity;
                                  const base = edit.price;
                                  const thumb = edit.include_thumbnail_creation;
                                  const posting = edit.include_content_posting;

                                  const totalBase = base * qty;
                                  const totalThumb = thumb * qty;
                                  const totalPost = posting * qty;

                                  return (
                                    <React.Fragment key={eidx}>
                                      {/* Base Editing */}
                                      <tr className="bg-white">
                                        <td className="border px-3 py-2">
                                          {edit.category}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {edit.type}
                                        </td>
                                        <td className="border px-3 py-2 text-right">
                                          {qty}
                                        </td>
                                        <td className="border px-3 py-2 text-right">
                                          ₹{base}
                                        </td>
                                        <td className="border px-3 py-2 text-right font-semibold">
                                          ₹{totalBase}
                                        </td>
                                      </tr>

                                      {/* Thumbnail */}
                                      {thumb > 0 && (
                                        <tr className="bg-gray-50">
                                          <td className="border px-3 py-2">
                                            {edit.category}
                                          </td>
                                          <td className="border px-3 py-2">
                                            Thumbnail Creation
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            {qty}
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            ₹{thumb}
                                          </td>
                                          <td className="border px-3 py-2 text-right font-semibold">
                                            ₹{totalThumb}
                                          </td>
                                        </tr>
                                      )}

                                      {/* Content Posting */}
                                      {posting > 0 && (
                                        <tr className="bg-gray-50">
                                          <td className="border px-3 py-2">
                                            {edit.category}
                                          </td>
                                          <td className="border px-3 py-2">
                                            Content Posting
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            {qty}
                                          </td>
                                          <td className="border px-3 py-2 text-right">
                                            ₹{posting}
                                          </td>
                                          <td className="border px-3 py-2 text-right font-semibold">
                                            ₹{totalPost}
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ))}

                        <p className="text-right text-lg font-semibold">
                          Graphic Total: ₹{graphicTotal.toLocaleString()}
                        </p>
                      </section>
                    )}

                    {/* Ads Services */}
                    {/* Ads Services */}
                    {adsData.length > 0 && (
                      <section className="mb-5">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
                          Ads Services
                        </h3>
                        <table className="w-full border text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                                Service
                              </th>
                              <th className="border px-3 py-2 text-right">
                                Amount (₹)
                              </th>
                              <th className="border px-3 py-2 text-right">
                                Percentage (%)
                              </th>

                              <th className="border px-3 py-2 text-right">
                                Final Total (₹)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {adsData.map((ad, idx) => {
                              const amount = Number(ad.amount || 0);
                              const percent = Number(ad.percent || 0);
                              const charge = Number(ad.charge || 0);
                              const totalBudget = Number(ad.charge || 0);

                              // Static 18% GST row
                              const gstPercent = 18;
                              const gstCharge = (amount * gstPercent) / 100;
                              const gstTotal = amount + gstCharge;

                              return (
                                <React.Fragment key={idx}>
                                  {/* Row 1 - dynamic Ad Budget */}

                                  <tr
                                    className={
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="border px-3 py-2">
                                      {ad.category_name} Budget (GST)
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {amount.toLocaleString()}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {gstPercent}
                                    </td>

                                    <td className="border px-3 py-2 text-right font-semibold">
                                      {gstTotal.toLocaleString()}
                                    </td>
                                  </tr>

                                  {/* Row 2 - static Ads Charges (18%) */}
                                  <tr
                                    className={
                                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }
                                  >
                                    <td className="border px-3 py-2">
                                      {ad.category_name} Charges{" "}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {amount.toLocaleString()}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {percent}
                                    </td>

                                    <td className="border px-3 py-2 text-right font-semibold">
                                      {totalBudget.toLocaleString()}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* Ads Total = budget total + gst total */}
                        <p className="text-right text-lg font-semibold mt-1">
                          Ads Total: ₹
                          {adsData
                            .reduce((sum, ad) => {
                              const amount = Number(ad.amount || 0);
                              const totalBudget = Number(ad.total_amount || 0);
                              const gstTotal = (amount * 18) / 100;
                              return sum + totalBudget + gstTotal;
                            }, 0)
                            .toLocaleString()}
                        </p>
                      </section>
                    )}
                    {complimentaryData.length > 0 && (
                      <section className="mb-2">
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">
                          Complimentary Services
                        </h3>

                        <table className="w-full border text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                                Category
                              </th>
                              <th className="border px-3 py-2 text-left">
                                Creative Type
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
                            {complimentaryData.map((edit, eidx) => {
                              const qty = Number(edit.quantity);
                              const base = Number(edit.editing_type_amount);
                              const thumb = Number(
                                edit.include_thumbnail_creation
                              );
                              const posting = Number(
                                edit.include_content_posting
                              );

                              const totalBase = base * qty;
                              const totalThumb = thumb * qty;
                              const totalPost = posting * qty;

                              return (
                                <React.Fragment key={eidx}>
                                  {/* Base Editing */}
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2">
                                      {edit.category_name}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {edit.editing_type_name}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {qty}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      ₹{base}
                                    </td>
                                    <td className="border px-3 py-2 text-right font-semibold">
                                      ₹{totalBase}
                                    </td>
                                  </tr>

                                  {/* Thumbnail */}
                                  {thumb > 0 && (
                                    <tr className="bg-gray-50">
                                      <td className="border px-3 py-2">
                                        {edit.category_name}
                                      </td>
                                      <td className="border px-3 py-2">
                                        Thumbnail Creation
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        {qty}
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        ₹{thumb}
                                      </td>
                                      <td className="border px-3 py-2 text-right font-semibold">
                                        ₹{totalThumb}
                                      </td>
                                    </tr>
                                  )}

                                  {/* Content Posting */}
                                  {posting > 0 && (
                                    <tr className="bg-gray-50">
                                      <td className="border px-3 py-2">
                                        {edit.category_name}
                                      </td>
                                      <td className="border px-3 py-2">
                                        Content Posting
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        {qty}
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        ₹{posting}
                                      </td>
                                      <td className="border px-3 py-2 text-right font-semibold">
                                        ₹{totalPost}
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>

                        <p className="text-right text-lg font-semibold">
                          Total: ₹{complimentaryTotal.toLocaleString()}
                        </p>
                        <p className="text-right text-lg font-semibold">
                          Complimentary Total: ₹0
                        </p>
                      </section>
                      
                    )}
 {clientData.tag_received_amt === "received" ? (
                  
                 null
                  ): (
                    <>
                    
                      <button
                  onClick={handleShow}
                  className="px-4 py-2 print:hidden mb-2 print:mb-0 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition"
                >
                  + Addition Service 
                </button>
                <button
                  onClick={handleRemainingShow}
                  className="mx-2 px-4 py-2 print:hidden mb-2 print:mb-0 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                >
                  + Remaining Amount
                </button>
                    </>
                  
)}

                        {additionalServiceData.length > 0 && (
                      <section className="mb-2">
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">
                          Additional Services
                        </h3>

                        <table className="w-full border text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                                Category
                              </th>
                              <th className="border px-3 py-2 text-left">
                                Creative Type
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
                               {clientData.tag_received_amt === "received" ? (
                  
                 null
                  ): (
                              <th className="border px-3 py-2 text-right print:hidden">
                                Action
                              </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {additionalServiceData.map((edit, eidx) => {
                              const qty = Number(edit.quantity);
                              const base = Number(edit.editing_type_amount);
                              const thumb = Number(
                                edit.include_thumbnail_creation
                              );
                              const posting = Number(
                                edit.include_content_posting
                              );

                              const totalBase = base * qty;
                              const totalThumb = thumb * qty;
                              const totalPost = posting * qty;

                              return (
                                <React.Fragment key={eidx}>
                                  {/* Base Editing */}
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2">
                                      {edit.category_name}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {edit.editing_type_name}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      {qty}
                                    </td>
                                    <td className="border px-3 py-2 text-right">
                                      ₹{base}
                                    </td>
                                    <td className="border px-3 py-2 text-right font-semibold">
                                      ₹{totalBase}
                                    </td>

                                     {clientData.tag_received_amt === "received" ? (
                  
                 null
                  ): (
                                      <td className="border px-3 py-2 text-right font-semibold print:hidden">
                                   
                                     <div className="flex gap-2">
                                     <button
                            onClick={() => handleEdit(edit)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(edit.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Delete"
                          >
                            ×
                          </button>
                          </div>
                                      </td>
                                      )}
                                  </tr>

                                  {/* Thumbnail */}
                                  {thumb > 0 && (
                                    <tr className="bg-gray-50">
                                      <td className="border px-3 py-2">
                                        {edit.category_name}
                                      </td>
                                      <td className="border px-3 py-2">
                                        Thumbnail Creation
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        {qty}
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        ₹{thumb}
                                      </td>
                                      <td className="border px-3 py-2 text-right font-semibold">
                                        ₹{totalThumb}
                                      </td>
                                    
                                    </tr>
                                  )}

                                  {/* Content Posting */}
                                  {posting > 0 && (
                                    <tr className="bg-gray-50">
                                      <td className="border px-3 py-2">
                                        {edit.category_name}
                                      </td>
                                      <td className="border px-3 py-2">
                                        Content Posting
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        {qty}
                                      </td>
                                      <td className="border px-3 py-2 text-right">
                                        ₹{posting}
                                      </td>
                                      <td className="border px-3 py-2 text-right font-semibold">
                                        ₹{totalPost}
                                      </td>
                                      
                                    </tr>


                                  )
                                  
                                  }
                                 
                                </React.Fragment>
                              );
                           
                           
                           })}
                          </tbody>
                        </table>

                        <p className="text-right text-lg font-semibold">
                          Additional Total: ₹{additionalTotal.toLocaleString()}
                        </p>
                    
                      </section>
                    )}
                        {remainingAmountData.length > 0 && (
                      <section className="mb-2">
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">
                         Remaining Amount
                        </h3>

                        <table className="w-full border text-sm">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                              Service
                              </th>
                              
                              <th className="border px-3 py-2 text-left">
                                Price (₹)
                              </th>
                            {clientData.tag_received_amt === "received" ? (
                  
                 null
                  ): (
                              <th className="border px-3 py-2 text-left print:hidden">
                                Action
                              </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {remainingAmountData.map((edit, eidx) => {
                            
                              return (
                                <React.Fragment key={eidx}>
                                  {/* Base Editing */}
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2">
                                      {edit.service_name}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {edit.price}
                                    </td>
                                   {clientData.tag_received_amt === "received" ? (
                  
                 null
                  ): (  
                               <td className="border px-3 py-2 text-right font-semibold print:hidden">
                                     <div className="flex gap-2">
                                     <button
                            onClick={() => handleEditRemaining(edit)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleRemainingDelete(edit.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Delete"
                          >
                            ×
                          </button>
                          </div>
                                      </td>
                                      )}
                                  </tr>

                                
                                 
                                </React.Fragment>
                              );
                           
                           
                           })}
                          </tbody>
                        </table>

                        <p className="text-right text-lg font-semibold">
                          Remaining Total: ₹{remainingTotalAmount.toLocaleString()}
                        </p>
                    
                      </section>
                    )}

                    {/* Grand Total Section */}
                    <section className="text-right border-t pt-3 mb-6">
                      <p className="text-xl text-gray-700">
                        Subtotal: ₹{grandTotal.toLocaleString()}
                      </p>

                      {selecteddiscount > 0 && (
                        <p className="text-lg text-red-600 mt-1">
                          Discount ({selecteddiscount}%): -₹
                          {discountAmount.toFixed(2).toLocaleString()}
                        </p>
                      )}

                      {isGST ? (
                        <>
                          <p className="text-lg text-gray-600 mt-1">
                            GST (18%): ₹{gstAmount.toLocaleString()}
                          </p>
                          <p className="text-2xl font-bold text-indigo-700 mt-2">
                            Total with GST: ₹{finalTotal.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-indigo-700 mt-2">
                          Grand Total: ₹
                          {totalAfterDiscount.toFixed(2).toLocaleString()}
                        </p>
                      )}
                    </section>
                    

                    {notesData.length > 0 ? (
                      <>
                        <h2 className="text-lg font-bold">Notes</h2>
                        <ul className="list-disc pl-5">
                          {notesData.map((note) => (
                            <li
                              key={note.id}
                              className="text-sm text-gray-700 font-bold"
                            >
                              {note.note_name}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="text-gray-500 italic"></p>
                    )}
                  </div>
                  {isGST ? (
                    <>
                      <div className=" flex justify-between">
                        {/* Bank Details */}
                        <div className="font-bold mt-12 ">
                          <h6>Bank Details: -</h6>

                          <ul className="space-y-1">
                            <li>Name: DOAGuru InfoSystems</li>
                            <li>IFSC Code: SBIN0004677</li>
                            <li>Account No: 38666325192</li>
                            <li>Bank: SBI Bank, Jabalpur</li>
                          </ul>
                        </div>

                        {/* Signature */}
                        <div className="">
                          <img
                            src={img4}
                            alt="Authorized Signature"
                            height={100}
                            width={200}
                            style={{ marginTop: "-1rem" }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className=" flex justify-between">
                      <div className="font-bold mt-12 ">
                        <h6>Bank Details For TDS Payment : - </h6>
                        <ul>
                          <li>Name : DOAGuru IT Solutions</li>
                          <li>IFSC Code : HDFC0000224 </li>
                          <li>Account No : 50200074931981</li>
                          <li>Bank : HDFC Bank , Jabalpur</li>
                        </ul>
                      </div>
                      <div className="">
                        <img
                          src={img3}
                          alt="Authorized Signature"
                          height={100}
                          width={200}
                          style={{ marginTop: "-1rem" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-[50rem]"></div>
              </td>
            </tr>
          </tbody>

          <tfoot className="print:table-footer-group">
            <tr>
              <td className="p-0 m-0">
                <div className="h-[100px]">
                  <img
                    src={img2}
                    alt="Footer"
                    className="w-full h-full object-contain"
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        {showModalInvoiceClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={handleCloseInvoiceClient}
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
                    {"Edit Invoice Detail"}
                  </h2>
                </div>
                <button
                  onClick={handleCloseInvoiceClient}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditInvoice} className="p-6 space-y-4">
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar1 className="w-4 h-4 inline mr-2" />
                    Inovice Date
                  </label>
                  <input
                    type="date"
                    name="created_at"
                    value={formData.created_at}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter Duration start date"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar1 className="w-4 h-4 inline mr-2" />
                    Duration start date
                  </label>
                  <input
                    type="date"
                    name="duration_start_date"
                    value={formData.duration_start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter Duration start date"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar1 className="w-4 h-4 inline mr-2" />
                    Duration end date
                  </label>
                  <input
                    type="date"
                    name="duration_end_date"
                    value={formData.duration_end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter Duration end date"
                    required
                  />
                </div>

              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Payment Mode
                  </label>
               <select
  name="payment_mode"
  value={formData.payment_mode}
  onChange={handleChange}
  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
   required
>
  <option  value="" className="text-gray-500">
   Select Payment Mode
  </option>
  <option value="Pending">Pending</option>
  <option value="Payment Cheque">Payment Cheque</option>
  <option value="Net Banking">Net Banking</option>
  <option value="UPI">UPI</option>
  <option value="Cash">Cash</option>
</select>

                </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Received Amount Status
                  </label>
               <select
  name="tag_received_amt"
  value={formData.tag_received_amt}
  onChange={handleChange}
  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"

>
  <option  value="" className="text-gray-500">
   Select Status
  </option>

  <option value="received">Received</option>

</select>

                </div>
               
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                   GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="client_gst_no"
                    value={formData.client_gst_no}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter GST Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                   Pan Card Number (Optional)
                  </label>
                  <input
                    type="number"
                    name="client_pan_no"
                    value={formData.client_pan_no}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter Pan Card Number"
                  />
                </div>

         

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseInvoiceClient}
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
        {showModalAddition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={handleCloseAddition}
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
                    { isEditingAddition ? "Edit Additional Detail" : "Add Additional Detail"}
                  </h2>
                </div>
                <button
                  onClick={handleCloseAddition}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <button
                  className=" px-4 py-1 float-end bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                  onClick={resetForm}
                >
                 <RefreshCcw/>
                </button>
                <div>
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
                        disabled={!!isEditingAddition} 
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
                </div>
               
                <div>
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
                        disabled={!!isEditingAddition} 
                          
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
                </div>
 <div>
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
                        disabled={!!isEditingAddition} 
                          
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
                </div>
             
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

               {selectedService === "Video Services" && optionalServices?.length > 0 && (
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
              disabled={isEditingAddition} // ✅ disable when editing
              className={`px-4 py-2 rounded ${
                addons[key]
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-black"
              } ${isEditingAddition ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() =>
                !isEditingAddition &&
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
              disabled={isEditingAddition} // ✅ disable when editing
              className={`px-4 py-2 rounded ${
                !addons[key]
                  ? "bg-red-600 text-white"
                  : "bg-gray-300 text-black"
              } ${isEditingAddition ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() =>
                !isEditingAddition &&
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
              disabled={isEditingAddition} // ✅ disable when editing
              className={`px-4 py-2 rounded ${
                addons[key]
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-black"
              } ${isEditingAddition ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() =>
                !isEditingAddition &&
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
              disabled={isEditingAddition} // ✅ disable when editing
              className={`px-4 py-2 rounded ${
                !addons[key]
                  ? "bg-red-600 text-white"
                  : "bg-gray-300 text-black"
              } ${isEditingAddition ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() =>
                !isEditingAddition &&
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

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseAddition}
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
            {showModalRemaining && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={handleClosesetRemaining}
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
                     { isEditingRemaining ? "Edit Remaining Amount Detail" : "Add Remaining Amount Detail"}
                  </h2>
                </div>
                <button
                  onClick={handleClosesetRemaining}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleRemainingSave} className="p-6 space-y-4">
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="service_name"
                    value={formDataRemaining.service_name}
                    onChange={handleChangeRemaining}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter Service Name"
                    required
                   disabled={!!isEditingRemaining} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                   
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formDataRemaining.price}
                    onChange={handleChangeRemaining}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter Duration start date"
                    required
                  />
                </div>
              
         

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClosesetRemaining}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    {loading ? "Saving..." : "Save Amount"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
       
      </div>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  @media print {
    @page {
      size: A4;
      margin: 0;
    }

    html,
    body {
      width: 210mm;
      height: auto;
      margin: 0;
      padding: 0;
    }

    .page-wrapper {
      break-after: page;
      page-break-after: always;
      width: 210mm;
      height: 297mm;
      display: block;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      height: 100%;
      table-layout: fixed;
    }

    thead {
      display: table-header-group;
    }

    tfoot {
      display: table-footer-group;
    }

    tbody {
      display: table-row-group;
      /* height: 80%; */
    }

    tr {
      page-break-inside: avoid;
    }

    td {
      vertical-align: top;
    }
  }
`;
