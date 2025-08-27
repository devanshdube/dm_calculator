const { db } = require("../connect");
const dotenv = require("dotenv");
dotenv.config();

exports.deleteService = async (req, res) => {
  const { service_id } = req.params;

  db.query(
    "DELETE FROM services WHERE service_id = ?",
    [service_id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      }
      res.json({ status: "Success", message: "Service deleted successfully" });
    }
  );
};

exports.deleteCategory = async (req, res) => {
  const { category_id } = req.params;

  db.query(
    "DELETE FROM categories WHERE category_id = ?",
    [category_id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      }
      res.json({ status: "Success", message: "Category deleted successfully" });
    }
  );
};

exports.deleteEditingType = async (req, res) => {
  const { editing_type_id } = req.params;

  db.query(
    "DELETE FROM editing_types WHERE editing_type_id = ?",
    [editing_type_id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      }
      res.json({
        status: "Success",
        message: "Editing type deleted successfully",
      });
    }
  );
};

exports.deleteAdsServices = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "Failure",
      message: "ID is required to delete the ad service.",
    });
  }

  try {
    db.query(
      "DELETE FROM dm_calculator_ads WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No ad service found with the given ID",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Ads Service deleted successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.deleteAdsCampaignDetails = async (req, res) => {
  const { txn_id, client_id } = req.params;

  try {
    db.query(
      "DELETE FROM ads_campaign_details WHERE txn_id = ? AND client_id = ?",
      [txn_id, client_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error while deleting",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No campaign data found to delete",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Campaign details deleted successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.deleteAdsCampaignEntryById = async (req, res) => {
  const { id } = req.params;

  try {
    db.query(
      "DELETE FROM ads_campaign_details WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error while deleting entry",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No campaign entry found to delete",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Campaign entry deleted successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.deleteGraphicEntryById = async (req, res) => {
  const { id } = req.params;

  try {
    db.query(
      "DELETE FROM calculator_transactions WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error while deleting entry",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No Graphic entry found to delete",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Campaign entry deleted successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};
exports.deleteGraphicEntryById = async (req, res) => {
  const { id } = req.params;

  try {
    db.query(
      "DELETE FROM calculator_transactions WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error while deleting entry",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No Graphic entry found to delete",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Campaign entry deleted successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.deleteClientById = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: delete notes first
    const deletePlanClientNotes =
      "DELETE FROM plan_client_notes WHERE client_id = ?";

    db.query(deletePlanClientNotes, [id], (err1) => {
      if (err1) {
        return res.status(500).json({
          status: "Failure",
          message: "Error deleting plan client notes",
          error: err1,
        });
      }

      // Step 2: delete client details
      const deleteClient =
        "DELETE FROM dm_calculator_client_details WHERE id = ?";

      db.query(deleteClient, [id], (err2, result) => {
        if (err2) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error while deleting client entry",
            error: err2,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No Client entry found to delete",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Client notes and details deleted successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.deleteQuoatationById = async (req, res) => {
  const { txn_id } = req.params;

  if (!txn_id) {
    return res.status(400).json({
      status: "Failure",
      message: "Missing txn_id parameter",
    });
  }

  const deleteCalculatorQuery =
    "DELETE FROM calculator_transactions WHERE txn_id = ?";
  const deleteAdsCampaignQuery =
    "DELETE FROM ads_campaign_details WHERE txn_id = ?";

  db.query(deleteCalculatorQuery, [txn_id], (err1, result1) => {
    if (err1) {
      return res.status(500).json({
        status: "Failure",
        message: "Error deleting from calculator_transactions",
        error: err1,
      });
    }

    db.query(deleteAdsCampaignQuery, [txn_id], (err2, result2) => {
      if (err2) {
        return res.status(500).json({
          status: "Failure",
          message: "Error deleting from ads_campaign_details",
          error: err2,
        });
      }

      const deletedFromCalculator = result1.affectedRows > 0;
      const deletedFromAds = result2.affectedRows > 0;

      if (!deletedFromCalculator && !deletedFromAds) {
        return res.status(404).json({
          status: "Failure",
          message: "No transaction found with the given txn_id",
        });
      }

      res.status(200).json({
        status: "Success",
        message: `Transaction deleted from ${
          deletedFromCalculator && deletedFromAds
            ? "both tables"
            : deletedFromCalculator
            ? "calculator_transactions"
            : "ads_campaign_details"
        } successfully`,
      });
    });
  });
};

exports.deletePlanNameDetail = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "Failure",
      message: "Missing id parameter",
    });
  }

  const deletePlanDetail = "DELETE FROM plan_details  WHERE id = ?";
  const deletePlanData = "DELETE FROM plan_data  WHERE plan_id = ?";

  db.query(deletePlanDetail, [id], (err1, result1) => {
    if (err1) {
      return res.status(500).json({
        status: "Failure",
        message: "Error delete plan detail",
        error: err1,
      });
    }

    db.query(deletePlanData, [id], (err2, result2) => {
      if (err2) {
        return res.status(500).json({
          status: "Failure",
          message: "Error delete plan data",
          error: err2,
        });
      }

      res.status(200).json({
        status: "Success",
        message: ` delete of plan_name in successfully`,
      });
    });
  });
};
exports.deletePlanData = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "Failure",
      message: "Missing id parameter",
    });
  }

  const deletePlanData = "DELETE FROM plan_data  WHERE plan_id = ?";

  db.query(deletePlanData, [id], (err2, result2) => {
    if (err2) {
      return res.status(500).json({
        status: "Failure",
        message: "Error delete plan data",
        error: err2,
      });
    }

    res.status(200).json({
      status: "Success",
      message: ` delete of plan_data in successfully`,
    });
  });
};

exports.deletePlanNotesbyid = async (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM plans_notes WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "Failure", message: "Database error" });
    }
    res.json({ status: "Success", message: "Note deleted successfully" });
  });
};

//  NEW WORK For Team work

exports.removeMemberFromTeam = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;

    const q = `DELETE FROM team_members WHERE team_id = ? AND employee_id = ?`;

    db.query(q, [teamId, memberId], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Failed to remove member",
        });
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          status: "Failure",
          message: "Member not found in team",
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "Member removed successfully",
        data: { removed: 1 },
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal Server Error",
    });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const q = `DELETE FROM teams WHERE id = ?`;

    db.query(q, [id], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Failed to delete team",
        });
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          status: "Failure",
          message: "Team not found",
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "Team deleted successfully",
        data: { deleted: 1 },
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal Server Error",
    });
  }
};
