import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Calendar,
  Search,
  ArrowLeft,
  X,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Timer,
  Calendar1,
  Trash,
  RefreshCcw,
  Package,
  StickyNote,
  Notebook,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
    created_at: "",
    duration_start_date: "",
    duration_end_date: "",
    payment_mode: "",
    client_gst_no: "",
    client_pan_no: "",
    tag_received_amt: "",
  });
  const [formDataRemaining, setFormDataRemaining] = useState({
    service_name: "",
    price: "",
  });

  const [formDataNote, setFormDataNote] = useState({
    note_name: "",
    plan: "Customise",
  });
  const [selectedNotesId, setSelectedNotesId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [predefinedNotes, setPredefinedNotes] = useState([]); // fetched from API
  const [selectedNotes, setSelectedNotes] = useState([]); // selected + manual
  const [manualNote, setManualNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      setSelecteddiscount(data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPredefinedNotes = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/auth/api/calculator/getInvoiceNoteData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredefinedNotes(data.data || []);
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
    fetchPredefinedNotes();
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
  const handleChangeNote = (e) => {
    const { name, value } = e.target;

    setFormDataNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCloseNote = () => {
    setShowModal(false);
    setFormDataNote({
      note_name: "",
      plan: "",
    });
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
        include_thumbnail_creation:
          Number(item.include_thumbnail_creation) || 0,
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
      editing_type_id: selectedEditingType.editing_type_id,
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
            text: isEditingAddition
              ? "Entry updated successfully"
              : "Saved successfully",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          fetchAdditionservice();
          setShowModalAddition(false);
        } else if (res.data.status === "Alert") {
          Swal.fire({
            icon: "warning",
            title: "Already Exists",
            text: res.data.message || "This Additoinal service already exists",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          resetForm();
          fetchAdditionservice();
          setShowModalAddition(false);
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
      });
  };

  const handleShowClientInvoice = () => {
    setFormData({
      created_at: moment(clientData.created_at).format("YYYY-MM-DD"),
      duration_start_date: clientData?.duration_start_date,
      duration_end_date: clientData?.duration_end_date,
      payment_mode: clientData?.payment_mode,
      client_gst_no: clientData?.client_gst_no,
      client_pan_no: clientData?.client_pan_no,
    });
    setShowModalInvoiceClient(true);
  };
  const handleEditRemaining = (items) => {
    setIsEditingRemaining(items.id);
    setFormDataRemaining({
      service_name: items.service_name,
      price: items.price,
    });
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
        created_at: formData?.created_at,
        duration_start_date: formData?.duration_start_date,
        duration_end_date: formData?.duration_end_date,
        payment_mode: formData?.payment_mode,
        client_gst_no: formData?.client_gst_no,
        client_pan_no: formData?.client_pan_no,
        tag_received_amt: formData?.tag_received_amt,
      };

      const payload = { ...clientDetail };
      await axios.put(
        `${baseURL}/auth/api/calculator/updateInvoiceClientDataById/${clientData.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Invoice Updated",
        text: "Invoice Update successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      fetchClient();
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
            text: isEditingAddition
              ? "Entry updated successfully"
              : "Saved successfully",
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting form data:", formDataNote);
      let response;

      if (isEditing && selectedNotesId) {
        response = await axios.put(
          `${baseURL}/auth/api/calculator/updateInvoiceClientNoteDataById/${selectedNotesId.id}`,
          formDataNote,
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
          formDataNote,
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
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          setShowModal(false);
          fetchClientNotes();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.data.message || "Failed to save Note. Please try again.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
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
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save note. Please try again.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleAddPredefinedNote = (note) => {
    if (!selectedNotes.find((n) => n.id === note.id)) {
      setSelectedNotes([
        ...selectedNotes,
        { id: note.id, note_name: note.note_text, type: "predefined" },
      ]);
    }
  };
  const handleAddManualNote = () => {
    if (manualNote.trim() !== "") {
      setSelectedNotes([
        ...selectedNotes,
        { id: Date.now(), note_name: manualNote, type: "manual" },
      ]);
      setManualNote("");
    }
  };

  const handleRemoveNote = (id) => {
    setSelectedNotes(selectedNotes.filter((note) => note.id !== id));
  };

  const handleSaveNotes = async () => {
    if (selectedNotes.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Notes",
        text: "Please add at least one note before saving.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const planNotes = selectedNotes.map((item) => ({
        note_name: item.note_name,
      }));

      const payload = {
        txn_id: txn_id,
        client_id: id,
        planNotes,
      };

      const response = await axios.post(
        `${baseURL}/auth/api/calculator/saveInvoiceClientIdwiseNotes`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "Alert") {
        Swal.fire({
          icon: "warning",
          title: "Duplicate Note",
          text: response.data.message,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        fetchClientNotes();
        setManualNote("");
        setPredefinedNotes([]);
        setSelectedNotes([]);
        fetchPredefinedNotes();
        return; // stop execution here
      }

      Swal.fire({
        icon: "success",
        title: "Notes Created",
        text: response.data.message || "Notes saved successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      fetchClientNotes();
      setManualNote("");
      setPredefinedNotes([]);
      setSelectedNotes([]);
      fetchPredefinedNotes();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the notes.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleDeleteClientNote = async (noteId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this note ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // red
      cancelButtonColor: "#6b7280", // gray
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${baseURL}/auth/api/calculator/deleteInvoiceClientNotes/${noteId}`
      );

      const result = res.data;

      if (result.status === "Success") {
        setNotesData((prev) => prev.filter((item) => item.id !== noteId));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "note has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchClientNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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
  const grandTotalAds =
    graphicTotal + adsTotal + additionalTotal - adsTotalBudget;

  const grandTotal =
    graphicTotal + adsTotal + additionalTotal + remainingTotalAmount;

  // Apply discount percentage only for display
  const discountAmount = selecteddiscount
  ? selecteddiscount.discount_type === "percent"
    ? (grandTotalAds * Number(selecteddiscount.discount_per)) / 100
    : selecteddiscount.discount_type === "amount"
    ? Number(selecteddiscount.discount_amt)
    : 0
  : 0;

// Grand total after discount
const totalAfterDiscount = grandTotal - discountAmount;

// GST on discounted total if applicable
const gstAmount = isGST ? (grandTotalAds - discountAmount) * 0.18 : 0;

// Final total including GST
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
        setAdditionalServiceData((prev) =>
          prev.filter((item) => item.id !== entryId)
        );

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
        setRemainingAmountData((prev) =>
          prev.filter((item) => item.id !== entryId)
        );

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
      created_at: "",
      duration_start_date: "",
      duration_end_date: "",
      payment_mode: "",
      client_gst_no: "",
      client_pan_no: "",
      tag_received_amt: "",
    });
  };
  const handleClosesetRemaining = () => {
    setShowModalRemaining(false);
    setFormDataRemaining({
      service_name: "",
      price: "",
    });
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
    document.title = clientOrganization
      ? `${clientOrganization} Invoice`
      : `${clientName} Invoice`;
    window.print();
  };
  const handleSelect = (note) => {
    handleAddPredefinedNote(note);
    setSelectedNote(null);
    setIsOpen(false);
  };

  const uniquePredefinedNotes = predefinedNotes.filter(
    (p) => !notesData.some((c) => c.note_name === p.note_text)
  );
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
                      className="w-full h-full object-cover " // use object-cover for full width fitting
                    />
                  ) : (
                    <img
                      src={img5}
                      alt="Header"
                      className="w-full h-full object-cover" // use object-cover for full width fitting
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
                <div className="flex flex-col justify-between h-full px-6 py-1 print:px-4 ">
                  {clientData.tag_received_amt === "received" ? null : (
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
                    <div className="flex justify-between text-xs mb-1">
                      <div className="space-y-1">
                        <p>
                          <strong>Payment Mode:</strong>{" "}
                          {clientData?.payment_mode}
                        </p>
                        <p>
                          <strong>Service From:</strong>{" "}
                          {moment(clientData?.duration_start_date).format(
                            "DD/MM/YYYY"
                          )}{" "}
                          to{" "}
                          {moment(clientData?.duration_end_date).format(
                            "DD/MM/YYYY"
                          )}
                        </p>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Invoice No:</strong> {clientData.id}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {moment(clientData.created_at).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                      {/* Client Info */}
                      <div className="border p-2 rounded-lg">
                         <p className=" font-bold">
                          BILL TO: {clientData.client_organization}{" "}
                        </p>
                        <p>
                          <strong>Name:</strong> {clientData?.client_name}
                        </p>

                        <p>
                          <strong>Contact:</strong> {clientData?.phone}
                        </p>
                        {clientData.client_gst_no && (
                          <p>
                            <strong>GST No:</strong> {clientData.client_gst_no}
                          </p>
                        )}
                        {clientData.client_pan_no && (
                          <p>
                            <strong>PAN No:</strong> {clientData.client_pan_no}
                          </p>
                        )}
                        {clientData.address && (
                          <p>
                            <strong>Address:</strong> {clientData.address}
                          </p>
                        )}
                      </div>

                      {/* Company Info */}
                      <div className="border p-2 rounded-lg">
                        <p className="font-bold">
                          FROM: DOAGuru Infosystems
                        </p>

                        <p>
                          <strong>Email:</strong> info@doaguru.com
                        </p>
                        <p>
                          <strong>Phone:</strong> +91 74409 92424
                        </p>
                        <p>
                          <strong>GST No:</strong> 23AGLPP2890G1Z7
                        </p>
                        <p>
                          <strong>Address:</strong> 1815, Wright Town, Jabalpur
                        </p>
                      </div>
                    </div>

                    {/* ==================== COMBINED SERVICES TABLE ==================== */}
                    {(graphicData.length > 0 ||
                      complimentaryData.length > 0 ||
                      additionalServiceData.length > 0 ||
                      remainingAmountData.length > 0) && (
                      <section className="mb-2 text-sm">
                        <table className="w-full border text-xs">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border w-[10rem] px-2 py-1 text-left">
                                DM Service
                              </th>
                              <th className="border w-[20rem] px-2 py-1 text-left">
                                Service Type
                              </th>
                              <th className="border px-2 py-1 text-right">
                                Quantity
                              </th>
                              <th className="border px-2 py-1 text-right">
                                Price (₹)
                              </th>
                              <th className="border px-2 py-1 text-right">
                                Total (₹)
                              </th>
                              {clientData.tag_received_amt !== "received" && (
                                <th className="border px-2 py-1 text-right print:hidden">
                                  Action
                                </th>
                              )}
                            </tr>
                          </thead>

                          <tbody>
                            {/* ================= GRAPHIC SERVICES (Grouped by Service) ================= */}
                            {graphicData.map((service, idx) =>
                              service.editingTypes.map((edit, eidx) => {
                                const qty = Number(edit.quantity);
                                const base = Number(edit.price);
                                const totalBase = base * qty;

                                return (
                                  <tr
                                    key={`graphic-${idx}-${eidx}`}
                                    className="bg-white"
                                  >
                                    {/* Show DM Service name only once using rowspan */}
                                    {eidx === 0 ? (
                                      <td
                                        className="border px-2 py-1 align-center"
                                        rowSpan={service.editingTypes.length}
                                      >
                                        {service.service}
                                      </td>
                                    ) : null}

                                    <td className="border px-2 py-1">
                                      {service.service === "Video Services"
                                        ? `${edit.category} With ${edit.type}`
                                        : edit.type}
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      {qty}
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      ₹{base}
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      ₹{totalBase}
                                    </td>
                                  </tr>
                                );
                              })
                            )}

                            {/* ================= THUMBNAIL CREATION TOTAL ================= */}
                            {(() => {
                              const thumbEdits = graphicData.flatMap(
                                (service) =>
                                  service.editingTypes.filter(
                                    (edit) =>
                                      Number(edit.include_thumbnail_creation) >
                                      0
                                  )
                              );
                              if (thumbEdits.length === 0) return null;

                              const totalThumbQty = thumbEdits.reduce(
                                (sum, edit) => sum + Number(edit.quantity),
                                0
                              );
                              const pricePerThumb =
                                thumbEdits[0]?.include_thumbnail_creation || 0;
                              const totalThumbAmount = thumbEdits.reduce(
                                (sum, edit) =>
                                  sum +
                                  Number(edit.include_thumbnail_creation) *
                                    Number(edit.quantity),
                                0
                              );

                              return (
                                <tr className="bg-gray-50">
                                  <td className="border px-2 py-1" colSpan={2}>
                                    Thumbnail Creation Total
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    {totalThumbQty}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{pricePerThumb}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{totalThumbAmount}
                                  </td>
                                </tr>
                              );
                            })()}

                            {/* ================= CONTENT POSTING TOTAL ================= */}
                            {(() => {
                              const postEdits = graphicData.flatMap((service) =>
                                service.editingTypes.filter(
                                  (edit) =>
                                    Number(edit.include_content_posting) > 0
                                )
                              );
                              if (postEdits.length === 0) return null;

                              const totalPostQty = postEdits.reduce(
                                (sum, edit) => sum + Number(edit.quantity),
                                0
                              );
                              const pricePerPost =
                                postEdits[0]?.include_content_posting || 0;
                              const totalPostAmount = postEdits.reduce(
                                (sum, edit) =>
                                  sum +
                                  Number(edit.include_content_posting) *
                                    Number(edit.quantity),
                                0
                              );

                              return (
                                <tr className="bg-gray-50">
                                  <td className="border px-2 py-1" colSpan={2}>
                                    Content Posting Total
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    {totalPostQty}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{pricePerPost}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{totalPostAmount}
                                  </td>
                                </tr>
                              );
                            })()}

                            {/* ================= ADDITIONAL SERVICES ================= */}
                            {additionalServiceData.map((edit, eidx) => {
                              const qty = Number(edit.quantity);
                              const base = Number(edit.editing_type_amount);
                              const totalBase = base * qty;

                              return (
                                <tr key={`add-${eidx}`} className="bg-white">
                                  {eidx === 0 ? (
                                    <td
                                      className="border px-2 py-1 align-top"
                                      rowSpan={additionalServiceData.length}
                                    >
                                      Additional Service
                                    </td>
                                  ) : null}
                                  <td className="border px-2 py-1">
                                    {edit.editing_type_name}
                                  </td>
                                  <td className="border  py-1 text-right">
                                    {qty}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{base}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{totalBase}
                                  </td>
                                  {clientData.tag_received_amt !==
                                    "received" && (
                                    <td className="border px-2 py-1 text-right print:hidden">
                                     
                                      <div className="flex gap-1">
                                       
                                        <button
                                          onClick={() => handleEdit(edit)}
                                          className="bg-blue-600 hover:bg-blue-700 text-white rounded w-6 h-6 flex items-center justify-center text-xs"
                                          title="Edit"
                                        >
                                         
                                          ✎{" "}
                                        </button>{" "}
                                        <button
                                          onClick={() => handleDelete(edit.id)}
                                          className="bg-red-600 hover:bg-red-700 text-white rounded w-6 h-6 flex items-center justify-center text-xs"
                                          title="Delete"
                                        >
                                         
                                          ×{" "}
                                        </button>{" "}
                                      </div>{" "}
                                    </td>
                                  )}
                                </tr>
                              );
                            })}

                            {/* ================= REMAINING AMOUNT ================= */}
                            {remainingAmountData.map((edit, eidx) => (
                              <tr key={`remain-${eidx}`} className="bg-gray-50">
                                {eidx === 0 ? (
                                  <td
                                    className="border px-2 py-1 align-top"
                                    rowSpan={remainingAmountData.length}
                                  >
                                    Remaining Amount
                                  </td>
                                ) : null}
                                <td className="border px-2 py-1" colSpan={2}>
                                  {edit.service_name}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                  ₹{edit.price}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                  ₹{edit.price}
                                </td>
                                {clientData.tag_received_amt !== "received" && (
                                  <td className="border px-2 py-1 text-right print:hidden">
                                   
                                    <div className="flex gap-1">
                                     
                                      <button
                                        onClick={() =>
                                          handleEditRemaining(edit)
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded w-6 h-6 flex items-center justify-center text-xs"
                                        title="Edit"
                                      >
                                       
                                        ✎{" "}
                                      </button>{" "}
                                      <button
                                        onClick={() =>
                                          handleRemainingDelete(edit.id)
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white rounded w-6 h-6 flex items-center justify-center text-xs"
                                        title="Delete"
                                      >
                                       
                                        ×{" "}
                                      </button>{" "}
                                    </div>{" "}
                                  </td>
                                )}
                              </tr>
                            ))}

                            {/* ================= DM SERVICE TOTAL ================= */}
                            {(() => {
                              const graphicTotal = graphicData.reduce(
                                (sum, service) =>
                                  sum +
                                  service.editingTypes.reduce(
                                    (s, edit) =>
                                      s +
                                      Number(edit.price) *
                                        Number(edit.quantity),
                                    0
                                  ),
                                0
                              );
                              const thumbTotal = graphicData
                                .flatMap((s) =>
                                  s.editingTypes.filter(
                                    (e) =>
                                      Number(e.include_thumbnail_creation) > 0
                                  )
                                )
                                .reduce(
                                  (sum, e) =>
                                    sum +
                                    Number(e.include_thumbnail_creation) *
                                      Number(e.quantity),
                                  0
                                );
                              const postTotal = graphicData
                                .flatMap((s) =>
                                  s.editingTypes.filter(
                                    (e) => Number(e.include_content_posting) > 0
                                  )
                                )
                                .reduce(
                                  (sum, e) =>
                                    sum +
                                    Number(e.include_content_posting) *
                                      Number(e.quantity),
                                  0
                                );
                              const addTotal = additionalServiceData.reduce(
                                (sum, e) =>
                                  sum +
                                  Number(e.editing_type_amount) *
                                    Number(e.quantity),
                                0
                              );
                              const remainingTotal = remainingAmountData.reduce(
                                (sum, e) => sum + Number(e.price || 0),
                                0
                              );

                              const dmServiceTotal =
                                graphicTotal +
                                thumbTotal +
                                postTotal +
                                addTotal +
                                remainingTotal;

                              return (
                                <tr className=" font-semibold">
                                  <td
                                    className="border px-2 py-1 text-right"
                                    colSpan={4}
                                  >
                                    DM Service Total
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{dmServiceTotal.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })()}
                            {/* ================= COMPLIMENTARY SERVICES ================= */}
                            {complimentaryData.map((edit, eidx) => {
                              const qty = Number(edit.quantity);
                              const base = Number(edit.editing_type_amount);
                              const totalBase = base * qty;

                              // For the first complimentary service, show "Complimentary Service" once
                              return (
                                <tr
                                  key={`compl-${eidx}`}
                                  className="bg-gray-50"
                                >
                                  {eidx === 0 ? (
                                    <td
                                      className="border px-2 py-1 align-center"
                                      rowSpan={complimentaryData.length}
                                    >
                                      Complimentary Service
                                    </td>
                                  ) : null}

                                  <td className="border px-2 py-1">
                                    {edit.editing_type_name}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    {qty}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{base}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{totalBase}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className=" font-semibold">
                              <td
                                className="border px-2 py-1 text-right"
                                colSpan={4}
                              >
                                Total
                              </td>
                              <td className="border px-2 py-1 text-right">
                                ₹{complimentaryTotal.toLocaleString()}
                              </td>
                            </tr>
                            {/* ================= COMPLIMENTARY TOTAL ================= */}
                            {(() => {
                              const complimentaryTotal =
                                complimentaryData.reduce(
                                  (sum, e) =>
                                    sum +
                                    Number(e.editing_type_amount) *
                                      Number(e.quantity),
                                  0
                                );

                              return (
                                <tr className=" font-semibold">
                                  <td
                                    className="border px-2 py-1 text-right"
                                    colSpan={4}
                                  >
                                    Complimentary Total
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹0
                                  </td>
                                </tr>
                              );
                            })()}

                            {/* ================= DM SERVICE TOTAL ================= */}
                            {(() => {
                              const graphicTotal = graphicData.reduce(
                                (sum, service) => {
                                  return (
                                    sum +
                                    service.editingTypes.reduce(
                                      (s, edit) =>
                                        s +
                                        Number(edit.price) *
                                          Number(edit.quantity),
                                      0
                                    )
                                  );
                                },
                                0
                              );

                              const thumbTotal = graphicData
                                .flatMap((s) =>
                                  s.editingTypes.filter(
                                    (e) =>
                                      Number(e.include_thumbnail_creation) > 0
                                  )
                                )
                                .reduce(
                                  (sum, e) =>
                                    sum +
                                    Number(e.include_thumbnail_creation) *
                                      Number(e.quantity),
                                  0
                                );

                              const postTotal = graphicData
                                .flatMap((s) =>
                                  s.editingTypes.filter(
                                    (e) => Number(e.include_content_posting) > 0
                                  )
                                )
                                .reduce(
                                  (sum, e) =>
                                    sum +
                                    Number(e.include_content_posting) *
                                      Number(e.quantity),
                                  0
                                );

                              const addTotal = additionalServiceData.reduce(
                                (sum, e) =>
                                  sum +
                                  Number(e.editing_type_amount) *
                                    Number(e.quantity),
                                0
                              );

                              const remainingTotal = remainingAmountData.reduce(
                                (sum, e) => sum + Number(e.price || 0),
                                0
                              );

                              const dmServiceTotal =
                                graphicTotal +
                                thumbTotal +
                                postTotal +
                                addTotal +
                                remainingTotal;

                              return (
                                <tr className=" font-semibold">
                                  <td
                                    className="border px-2 py-1 text-right"
                                    colSpan={4}
                                  >
                                    Total Amount
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    ₹{dmServiceTotal.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </section>
                    )}

                    {/* ==================== ADS SERVICES TABLE ==================== */}
                    {adsData.length > 0 && (
                      <section className="mb-2 text-xs">
                        <table className="w-full border text-xs">
                          <thead className="bg-indigo-100">
                            <tr>
                              <th className="border px-2 py-1 text-left">
                               
                                Ads Services
                              </th>
                              <th className="border px-2 py-1 text-right">
                                Amount (₹)
                              </th>
                              <th className="border px-2 py-1 text-right">
                                Percentage (%)
                              </th>
                              <th className="border px-2 py-1 text-right">
                                Final Total (₹)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {adsData.map((ad, idx) => {
                              const amount = Number(ad.amount || 0);
                              const percent = Number(ad.percent || 0);
                              const totalBudget = Number(ad.charge || 0);
                              const gstTotal = amount + (amount * 18) / 100;

                              return (
                                <React.Fragment key={idx}>
                                  <tr className="bg-white">
                                    <td className="border px-2 py-1">
                                      {ad.category_name} Budget (GST)
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      {amount.toLocaleString()}
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      18
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      {gstTotal.toLocaleString()}
                                    </td>
                                  </tr>
                                  <tr className="bg-gray-50">
                                    <td className="border px-2 py-1">
                                      {ad.category_name} Charges
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      {amount.toLocaleString()}
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      {percent}
                                    </td>
                                    <td className="border px-2 py-1 text-right">
                                      {totalBudget.toLocaleString()}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>

                        <p className="text-right text-xs mt-1">
                          <span className="font-bold">Ads Total:</span> ₹
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
                    {clientData.tag_received_amt !== "received" && (
                      <div className="mt-1">
                        <button
                          onClick={handleShow}
                          className="px-2 py-1 print:hidden mb-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                        >
                          + Additional Service
                        </button>
                        <button
                          onClick={handleRemainingShow}
                          className="px-2 py-1 mx-1 print:hidden mb-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                        >
                          + Remaining Amount
                        </button>
                      </div>
                    )}

            <section className="text-right border-t pt-1 mb-1">
  {/* Subtotal */}
  <p className="text-sm text-gray-700">
    Subtotal: ₹{grandTotal.toLocaleString()}
  </p>

  {/* Discount */}
  {selecteddiscount && (
    <p className="text-sm text-red-600">
      Discount (
      {selecteddiscount.discount_type === "percent"
        ? `${selecteddiscount.discount_per}%`
        : `₹${selecteddiscount.discount_amt}`}
      ): -₹
      {discountAmount.toFixed(2).toLocaleString()}
    </p>
  )}

  {/* GST & Total */}
  {isGST ? (
    <>
      <p className="text-md text-gray-600">
        GST (18%): ₹{gstAmount.toLocaleString()}
      </p>
      <p className="text-md font-bold text-indigo-700">
        Total with GST: ₹{finalTotal.toLocaleString()}
      </p>
    </>
  ) : (
    <p className="text-md font-bold text-indigo-700">
      Grand Total: ₹{totalAfterDiscount.toFixed(2).toLocaleString()}
    </p>
  )}
</section>

                    <div className=" print:hidden">
                      {/* <h3 className="text-xl font-bold  mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Notes Section
                  </h3> */}

                      <div className="space-y-4">
                        {/* <div className="relative w-full" ref={dropdownRef}>

         <div
          className="flex items-center justify-between w-full p-2 bg-white rounded-lg border border-gray-300 text-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {selectedNote ? selectedNote.note_text : "-- Select Predefined Note --"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
  
        {isOpen && (
          <div className="absolute z-10 bg-white w-full mt-1 max-h-60 overflow-auto border rounded-lg text-black focus:ring-2 focus:ring-purple-500">
            {uniquePredefinedNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleSelect(note)}
                className="p-2 m-1 border rounded-lg bg-gray-100 hover:bg-purple-100 cursor-pointer break-words"
              >
                {note.note_text}
              </div>
            ))}
          </div>
        )}
      </div> */}

                        {/* Manual Note Input */}
                        {/* <div className="flex flex-wrap gap-2">
                      <textarea
                        type="text"
                        value={manualNote}
                        onChange={(e) => setManualNote(e.target.value)}
                        placeholder="Enter custom note"
                        rows={1}
                
                        className="flex-1 p-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={handleAddManualNote}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                      >
                        + Add
                      </button>
                    </div> */}

                        {/* Selected Notes List */}
                        {/* <div className="space-y-2">
                      {selectedNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 bg-gray-100 rounded-lg gap-5 flex justify-between items-center border border-gray-300"
                        >
                          <span className="text-gray-800 font-medium">
                            {note.note_name}
                          </span>
                          <div className="">
                          <button
                            onClick={() => handleRemoveNote(note.id)}
                            className="bg-red-500 mx-2 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold transition"
                            title="Remove"
                          >
                            ×
                          </button></div>
                        </div>
                      ))}
                    </div> */}

                        {/* Save Button */}
                        {/* <button
                      onClick={handleSaveNotes}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                    >
                      💾 Save Notes
                    </button> */}
                      </div>

                      {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          {/* Backdrop */}
                          <div
                            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                            onClick={handleCloseNote}
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
                                onClick={handleCloseNote}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Form */}
                            <form
                              onSubmit={handleSubmit}
                              className="p-6 space-y-4"
                            >
                              {/* Note */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  <Notebook className="w-4 h-4 inline mr-2" />
                                  Note
                                </label>
                                <textarea
                                  name="note_name"
                                  value={formDataNote.note_name}
                                  onChange={handleChangeNote}
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
                                  onClick={handleCloseNote}
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
                    </div>

                    {/* {notesData.length > 0 ? (<>

                    <h2 className="text-lg mt-3 font-bold">Notes</h2>
                 
                      <ul className="list-disc pl-5">
                        {notesData.map((note) => (
                          <>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
                          <li
                            key={note.id}
                            className="text-sm text-gray-700 font-bold"
                          >
                            {note.note_name}
                          </li>
                           <div className="flex print:hidden items-center gap-2 sm:gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent card onClick
                              setSelectedNotesId(note);
                              setFormDataNote({
                                note_name: note.note_name,
                                plan: note.plan,
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
                            onClick={() => handleDeleteClientNote(note.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            title="Delete"
                          >
                            ×
                          </button>
                          </div>
                          </div>
                          </>
                          
                          
                        ))}
                      </ul>
                       
                    </>
                    
                    ) : (
                      <p className="text-gray-500 italic"></p>
                    )} */}
                  </div>
                  {isGST ? (
                    <div className="flex justify-between text-sm font-bold">
                      {/* Bank Details */}
                      <div>
                        <h6 className="mb-1">Bank Details:</h6>
                        <ul className="space-y-0.5">
                          <li>Name: DOAGuru InfoSystems</li>
                          <li>IFSC Code: SBIN0004677</li>
                          <li>Account No: 38666325192</li>
                          <li>Bank: SBI Bank, Jabalpur</li>
                        </ul>
                      </div>

                      {/* Signature */}
                      <div>
                        <img
                          src={img4}
                          alt="Authorized Signature"
                          className="h-28 w-40 mt-0"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between text-xs font-bold">
                      {/* Bank Details for TDS */}
                      <div>
                        <h6 className="mb-1">Bank Details For TDS Payment:</h6>
                        <ul className="space-y-0.5">
                          <li>Name: DOAGuru IT Solutions</li>
                          <li>IFSC Code: HDFC0000224</li>
                          <li>Account No: 50200074931981</li>
                          <li>Bank: HDFC Bank, Jabalpur</li>
                        </ul>
                      </div>

                      {/* Signature */}
                      <div>
                        <img
                          src={img3}
                          alt="Authorized Signature"
                          className="h-28 w-40 -mt-2"
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
                <div className="h-[150px]">
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
                    <option value="" className="text-gray-500">
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
                    <option value="" className="text-gray-500">
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
                    {isEditingAddition
                      ? "Edit Additional Detail"
                      : "Add Additional Detail"}
                  </h2>
                </div>
                <button
                  onClick={handleCloseAddition}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mx-2 mt-2">
                <button
                  className=" px-4 py-1 float-end bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                  onClick={resetForm}
                >
                  <RefreshCcw />
                </button>
              </div>
              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
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
                                disabled={isEditingAddition} // ✅ disable when editing
                                className={`px-4 py-2 rounded ${
                                  addons[key]
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-300 text-black"
                                } ${
                                  isEditingAddition
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
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
                                } ${
                                  isEditingAddition
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
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
                                } ${
                                  isEditingAddition
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
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
                                } ${
                                  isEditingAddition
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
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
                    {isEditingRemaining
                      ? "Edit Remaining Amount Detail"
                      : "Add Remaining Amount Detail"}
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
                    min="1"
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
