const express = require("express");
const {
  register,
  login,
  forgotPassword,
  insertServices,
  getServices,
  updateServices,
  insertAdsServices,
  getAdsServices,
  updateAdsServices,
  insertClientDetails,
  getClientDetails,
  getClientsByEmployee,
  addServices,
  addCategories,
  addEditingTypes,
} = require("../controller/controller");
const {
  getAddServices,
  getAddCategories,
  getAddEditingTypes,
  getAllServiceData,
} = require("../controller/getController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/insertServices", insertServices);
router.get("/getServices", getServices);
router.put("/updateServices/:id", updateServices);
router.post("/insertAdsServices", insertAdsServices);
router.get("/getAdsServices", getAdsServices);
router.put("/updateAdsServices/:id", updateAdsServices);
router.post("/insertClientDetails", insertClientDetails);
router.get("/getClientDetails", getClientDetails);
router.get("/getClientsByEmployee/:employee", getClientsByEmployee);
router.post("/addServices", addServices);
router.post("/addCategories", addCategories);
router.post("/addEditingTypes", addEditingTypes);

// ---->  Get all routes START <----
router.get("/getAddServices", getAddServices);
router.get("/categories/:service_id", getAddCategories);
router.get("/getAddEditingTypes/:service/:category", getAddEditingTypes);
router.get("/api/services/details/all", getAllServiceData);
// ---->  Get all routes END <----

module.exports = router;
