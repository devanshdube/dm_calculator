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
  verifyOtpAndResetPassword,
  saveCalculatorDataOfPlan,
  saveCalculatorDataOfPlanDetail,
  saveClientWithPlan,
  addNotebyplan,
  savePlanClientNotes,
  saveClientIdwiseNotes,
  assignQuotation,
  setDoneQty,
  incrementDoneQty,
  reassignQuotation,
  createTeam,
  addMembersToTeam,
  assignQuotationToTeam,
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
  getClientDetailsEmp,
  getAllClientsTxnHistory,
  getClientsTxnHistoryByEmployee,
  getAllBD,
  optionalServiceAmounts,
  getPlanData,
  getPlanDetails,
  getPlanDetailsById,
  getPlanDataById,
  getPlanNotes,
  getClientNotesbyId,
  retrieveUser,
  getAssignmentByTxn,
  getAssignedQuotations,
  getProgressByTxn,
  getAssignedQuotationsByEmployeeName,
  retrieveTeam,
  retrieveTeamById,
  getAssignmentsSummary,
} = require("../controller/getController");
const {
  deleteService,
  deleteCategory,
  deleteEditingType,
  deleteAdsServices,
  deleteAdsCampaignDetails,
  deleteAdsCampaignEntryById,
  deleteGraphicEntryById,
  deleteClientById,
  deleteQuoatationById,
  deletePlanNameDetail,
  deletePlanNotesbyid,
  removeMemberFromTeam,
  deleteTeam,
} = require("../controller/deleteController");
const {
  updateService,
  updateCategory,
  updateEditingType,
  updateCalculatorDataById,
  updateClientDetails,
  updatePlandata,
  updatePlanNameDetail,
  updatePlanNotes,
  // reassignQuotation,
} = require("../controller/updateController");

const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/register", register);
router.post("/registerBD", authenticateToken, registerBD);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verifyOTP-forgot", verifyOtpAndResetPassword);
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
router.post("/saveCalculatorDataofplan", saveCalculatorDataOfPlan);
router.post("/saveCalculatorDataofplanDetail", saveCalculatorDataOfPlanDetail);
router.post("/saveClientWithPlan", saveClientWithPlan);
router.post("/addNotebyplan", addNotebyplan);
router.post("/savePlanClientNotes", savePlanClientNotes);
router.post("/saveClientIdwiseNotes", saveClientIdwiseNotes);
router.post("/assignQuotation", assignQuotation);
router.post("/createTeam", createTeam);
router.post("/addMembersToTeam/:id/members", addMembersToTeam);
router.post("/assignQuotationToTeam", assignQuotationToTeam);

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

router.get(
  "/getAllClientsTxnHistory",
  authenticateToken,
  getAllClientsTxnHistory
);
router.get("/getAllBD", getAllBD);

router.get("/getAllPlanData", getPlanData);
router.get("/getAllPlanDataById/:id", getPlanDataById);
router.get("/getAllPlanDetails", getPlanDetails);
router.get("/getAllPlanDetailsById/:id", getPlanDetailsById);
router.get("/getPlanNotes", getPlanNotes);
router.get("/getClientNotesbyId/:client_id/:txn_id", getClientNotesbyId);

// >>>>>>>>>> BD GET API's <<<<<<<<<<<
router.get("/getClientDetailsEmp/:dg_employee", getClientDetailsEmp);

router.get(
  "/getClientsTxnByEmployee/:dg_employee",
  authenticateToken,
  getClientsTxnHistoryByEmployee
);
//NEW work
router.get("/retrieveUser", retrieveUser);
router.get("/getAssignmentByTxn/:txn_id", getAssignmentByTxn);
router.get("/getAssignedQuotations", getAssignedQuotations);
router.get(
  "/assigned-quotations/by-employee/:employee_name",
  getAssignedQuotationsByEmployeeName
);
router.get("/progress/by-txn/:txn_id", getProgressByTxn);
router.get("/retrieveTeam", retrieveTeam);
router.get("/retrieveTeamById/:id", retrieveTeamById);
router.get("/getAssignmentsSummary/:txn_id", getAssignmentsSummary);
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

router.delete("/deleteClientById/:id", deleteClientById);

router.delete("/deleteQuotationById/:txn_id", deleteQuoatationById);

router.delete("/deletePlanNameDetail/:id", deletePlanNameDetail);

router.delete("/deletePlanNotesbyid/:id", deletePlanNotesbyid);

router.delete(
  "/removeMemberFromTeam/:teamId/members/:memberId",
  removeMemberFromTeam
);

router.delete("/deleteTeam/:id", deleteTeam);

// ---->  DELETE all routes END <----

// ---->  UPDATE all routes START <----
router.put("/updateService/:service_id", updateService);
router.put("/updateCategory/:category_id", updateCategory);
router.put("/updateEditingType/:editing_type_id", updateEditingType);
router.put("/updateGraphicEntryById/:id", updateCalculatorDataById);
router.put("/updateClientDetails/:id", updateClientDetails);
router.put("/updatePlanData/:id", updatePlandata);
router.put("/updatePlanName/:id", updatePlanNameDetail);
router.put("/updatePlanNotes/:id", updatePlanNotes);
router.put("/reassignQuotation", reassignQuotation);
// router.put("/reassignQuotation", reassignQuotation);
// ---->  UPDATE all routes END <----

router.get("/optional-service-amounts", optionalServiceAmounts);

router.patch("/progress/set-done", setDoneQty);
router.patch("/progress/increment", incrementDoneQty);

module.exports = router;
