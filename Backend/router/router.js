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
} = require("../controller/controller");

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

module.exports = router;
