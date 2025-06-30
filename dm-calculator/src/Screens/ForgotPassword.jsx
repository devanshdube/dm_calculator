import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const ForgotPassword = () => {
  const baseURL = `http://localhost:5555`;
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/auth/api/calculator/forgot-password`,
        { User: userId }
      );
      if (response.data.status === "Success") {
        Swal.fire("Success", response.data.message, "success");
        setOtpSent(true);
        setShowOtpModal(true);
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire("Error", "Error sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/auth/api/calculator/verifyOTP-forgot`,
        {
          User: userId,
          otp: otp,
          newPassword: newPassword,
        }
      );
      if (response.data.status === "Success") {
        Swal.fire("Success", response.data.message, "success");
        setShowOtpModal(false);
        navigate("/");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire("Error", "Error resetting password", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-300">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mt-20">
        <div className="text-center">
          <h3 className="text-orange-400 text-2xl font-bold">DM Calculator</h3>
          <h4 className="text-gray-600 mt-2 text-lg">Forgot Your Password?</h4>
          <p className="text-sm text-gray-500">
            Enter your email to receive an OTP and reset your password.
          </p>
        </div>
        <div className="mt-6">
          <label className="block font-semibold mb-1">Enter Email ID</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded text-black"
            placeholder="Enter your User Email"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <button
          onClick={handleSendOtp}
          className="w-full bg-orange-400 text-white py-2 rounded mt-4 hover:bg-red-300 transition"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>

      {/* Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Enter OTP and New Password
            </h2>
            {otpSent && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">OTP</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded text-black"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full border px-3 py-2 rounded text-black"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={handleResetPassword}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => setShowOtpModal(false)}
                    className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
