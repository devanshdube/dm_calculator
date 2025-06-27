const express = require("express");
const {
  register,
  login,
  forgotPassword,
  // insertServices,
  // getServices,
  // updateServices,
  insertAdsServices,
  updateAdsServices,
  insertClientDetails,
  getClientDetails,
  getClientsByEmployee,
  addServices,
  addCategories,
  addEditingTypes,
  saveCalculatorData,
  saveAdsCampaign,
  registerBD,
} = require("../controller/controller");
const {
  getAddServices,
  getAddCategories,
  getAddEditingTypes,
  getAllServiceData,
  getAdsServices,
  getAllServiceDatas,
  getCalculatorTransactions,
  getByIDCalculatorTransactions,
  getByIDAdsCampaignDetails,
  getClientDetailsById,
  getClientTxnHistory,
  getClientServiceHistory,
} = require("../controller/getController");
const {
  deleteService,
  deleteCategory,
  deleteEditingType,
  deleteAdsServices,
  deleteAdsCampaignDetails,
  deleteAdsCampaignEntryById,
  deleteGraphicEntryById,
} = require("../controller/deleteController");
const {
  updateService,
  updateCategory,
  updateEditingType,
} = require("../controller/updateController");

const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/register", register);
router.post("/registerBD", authenticateToken, registerBD);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
// router.post("/insertServices", insertServices);
// router.get("/getServices", getServices);
// router.put("/updateServices/:id", updateServices);
router.post("/insertAdsServices", insertAdsServices);
router.put("/updateAdsServices/:id", updateAdsServices);
router.post("/insertClientDetails", insertClientDetails);
router.get("/getClientDetails", getClientDetails);
router.get("/getClientsByEmployee/:employee", getClientsByEmployee);
router.post("/addServices", addServices);
router.post("/addCategories", addCategories);
router.post("/addEditingTypes", addEditingTypes);
router.post("/saveCalculatorData", saveCalculatorData);
router.post("/saveAdsCampaign", saveAdsCampaign);

// ---->  Get all routes START <----
router.get("/getAddServices", authenticateToken, getAddServices);
router.get("/categories/:service_id", getAddCategories);
router.get("/getAddEditingTypes/:service/:category", getAddEditingTypes);
router.get("/api/services/details/all", authenticateToken, getAllServiceData);
router.get("/getAdsServices", authenticateToken, getAdsServices);
router.get("/services/category/editing", getAllServiceDatas);
router.get("/getCalculatorTransactions", getCalculatorTransactions);
router.get(
  "/getByIDCalculatorTransactions/:txn_id/:client_id",
  authenticateToken,
  getByIDCalculatorTransactions
);
router.get(
  "/getByIDAdsCampaignDetails/:txn_id/:client_id",
  authenticateToken,
  getByIDAdsCampaignDetails
);
router.get(
  "/getClientDetailsById/:id",
  authenticateToken,
  getClientDetailsById
);
router.get(
  "/getClientTxnHistory/:client_id",
  authenticateToken,
  getClientTxnHistory
);
router.get(
  "/getClientServiceHistory/:client_id/:txn_id",
  authenticateToken,
  getClientServiceHistory
);

// ---->  Get all routes END <----

// ---->  DELETE all routes START <----
router.delete("/deleteService/:service_id", deleteService);
router.delete("/deleteCategory/:category_id", deleteCategory);
router.delete("/deleteEditingType/:editing_type_id", deleteEditingType);
router.delete("/ads/delete/:id", deleteAdsServices);
router.delete(
  "/deleteAdsCampaignDetails/:txn_id/:client_id",
  deleteAdsCampaignDetails
);
router.delete("/deleteAdsCampaignEntryById/:id", deleteAdsCampaignEntryById);
router.delete("/deleteGraphicEntryById/:id", deleteGraphicEntryById);
// ---->  DELETE all routes END <----

// ---->  UPDATE all routes START <----
router.put("/updateService/:service_id", updateService);
router.put("/updateCategory/:category_id", updateCategory);
router.put("/updateEditingType/:editing_type_id", updateEditingType);
// ---->  UPDATE all routes END <----

module.exports = router;
