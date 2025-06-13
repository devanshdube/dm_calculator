const express = require("express");
const {
  register,
  login,
  forgotPassword,
  insertServices,
  getServices,
  updateServices,
  insertAdsServices,
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
  getAdsServices,
} = require("../controller/getController");
const {
  deleteService,
  deleteCategory,
  deleteEditingType,
  deleteAdsServices,
} = require("../controller/deleteController");
const {
  updateService,
  updateCategory,
  updateEditingType,
} = require("../controller/updateController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/insertServices", insertServices);
router.get("/getServices", getServices);
router.put("/updateServices/:id", updateServices);
router.post("/insertAdsServices", insertAdsServices);
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
router.get("/getAdsServices", getAdsServices);
// ---->  Get all routes END <----

// ---->  DELETE all routes START <----
router.delete("/deleteService/:service_id", deleteService);
router.delete("/deleteCategory/:category_id", deleteCategory);
router.delete("/deleteEditingType/:editing_type_id", deleteEditingType);
router.delete("/ads/delete/:id", deleteAdsServices);

// ---->  DELETE all routes END <----

// ---->  UPDATE all routes START <----
router.put("/updateService/:service_id", updateService);
router.put("/updateCategory/:category_id", updateCategory);
router.put("/updateEditingType/:editing_type_id", updateEditingType);
// ---->  UPDATE all routes END <----

module.exports = router;
