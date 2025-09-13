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
  saveComplimentaryData,
  generateClientLink,
  submitRequirement,
  saveNotesData,
  saveDiscountData,
  saveInvoiceData,
  saveInvoiceGD,
  saveInvoiceAdsCampaign,
  saveInvoiceComplimentaryData,
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
  getByIDComplimentaryData,
  getRequirementsLink,
  getRequirementsDetail,
  getNoteData,
  getByIDDiscountData,
  getInvoiceByIdData,
  getinInvoiceServiceHistory,
  getAllInvoiceServiceHistory,
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
  deletePlanDataByService,
  deletePlanbyChangeNotes,
  deleteClientAllPlanData,
  deletePlanClientNotes,
  removeMemberFromTeam,
  deleteTeam,
  deleteComplimenatryById,
  deleteNoteById,
  deleteRequirementsBundle,
  deleteDiscountById,
  deleteInvoiceById,
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
  updateServiceData,
  updateComplimenatryDataById,
  updateNoteDataById,
  updateClientNoteDataById,
  updateDiscountDataById,
  updateInvoiceDataById
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
router.post("/saveClientWithPlan", saveClientWithPlan);
router.post("/addNotebyplan", addNotebyplan);
router.post("/savePlanClientNotes", savePlanClientNotes);
router.post("/saveClientIdwiseNotes", saveClientIdwiseNotes);
router.post("/assignQuotation", assignQuotation);
router.post("/createTeam", createTeam);
router.post("/addMembersToTeam/:id/members", addMembersToTeam);
router.post("/assignQuotationToTeam", assignQuotationToTeam);

router.post("/saveComplimentaryData", saveComplimentaryData);

router.post("/generateClientLink", generateClientLink);
router.post("/submitRequirement", submitRequirement);
router.post("/saveNotesData", saveNotesData);
router.post("/saveDiscountData", saveDiscountData);
router.post("/saveInvoiceData", saveInvoiceData);
router.post("/saveInvoiceGD", saveInvoiceGD);
router.post("/saveInvoiceAdsCampaign", saveInvoiceAdsCampaign);
router.post("/saveInvoiceComplimentaryData", saveInvoiceComplimentaryData);

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
router.get(
  "/getByIDComplimentaryData/:txn_id/:client_id",
  authenticateToken,
  getByIDComplimentaryData
);

router.get(
  "/getinInvoiceServiceHistory/:client_id/:txn_id",
  authenticateToken,
  getinInvoiceServiceHistory
);
router.get(
  "/getAllInvoiceServiceHistory/:client_id/:txn_id",
  authenticateToken,
  getAllInvoiceServiceHistory
);
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
router.get("/requirements", getRequirementsLink);
router.get("/getRequirementsDetail/:linkId", getRequirementsDetail);
router.get("/getNoteData", getNoteData);
router.get(
  "/getByIDDiscountData/:client_id/:txn_id",
  authenticateToken,
  getByIDDiscountData
);
router.get(
  "/getInvoiceByIdData/:client_id/:txn_id",
  authenticateToken,
  getInvoiceByIdData
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

router.delete("/deleteClientById/:id", deleteClientById);

router.delete("/deleteQuotationById/:txn_id", deleteQuoatationById);

router.delete("/deletePlanNameDetail/:id", deletePlanNameDetail);

router.delete("/deletePlanNotesbyid/:id", deletePlanNotesbyid);

router.delete("/deletePlanDataByService/:id", deletePlanDataByService);

router.delete("/deletePlanbyChangeNotes/:txn_id", deletePlanbyChangeNotes);

router.delete("/deleteClientAllPlanData/:txn_id", deleteClientAllPlanData);

router.delete("/deletePlanClientNotes/:id", deletePlanClientNotes);

router.delete(
  "/removeMemberFromTeam/:teamId/members/:memberId",
  removeMemberFromTeam
);

router.delete("/deleteTeam/:id", deleteTeam);

router.delete("/deleteComplimenatryById/:id", deleteComplimenatryById);
router.delete("/deleteNoteById/:id", deleteNoteById);
router.delete("/deleteDiscountById/:id", deleteDiscountById);
router.delete("/deleteInvoiceById/:id", deleteInvoiceById);

router.delete("/deleteRequirementsBundle/:linkId", deleteRequirementsBundle);

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
router.put("/updateServiceData/:editing_type_id", updateServiceData);
router.put("/reassignQuotation", reassignQuotation);
router.put("/updateComplimenatryDataById/:id", updateComplimenatryDataById);
router.put("/updateNoteDataById/:id", updateNoteDataById);
router.put("/updateClientNoteDataById/:id", updateClientNoteDataById);
router.put("/updateDiscountDataById/:id", updateDiscountDataById);
router.put("/updateInvoiceDataById/:id", updateInvoiceDataById);
// router.put("/reassignQuotation", reassignQuotation);
// ---->  UPDATE all routes END <----

router.get("/optional-service-amounts", optionalServiceAmounts);

router.patch("/progress/set-done", setDoneQty);
router.patch("/progress/increment", incrementDoneQty);

module.exports = router;
