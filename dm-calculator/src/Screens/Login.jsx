import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import img1 from "../assets/79dd5e221567809.67d70a7ee99ae.jpg";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/userSlice";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseURL = "http://localhost:5555";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in both email and password.",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/auth/api/calculator/login`,
        {
          employee_email: email,
          employee_password: password,
        }
      );
      if (
        response.data.status === "Success" &&
        response.data.message === "Login successful"
      ) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        });
        const user = response.data.user;
        const token = response.data.token;
        dispatch(setUser({ user, token }));
        // console.log(user);
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message || "Invalid credentials.",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
    // console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${img1})`,
          backgroundColor: "#FF6B47",
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl relative">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="relative">
                  <div className="block text-white/80 text-sm font-medium mb-2">
                    Email
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white/5 border-b-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 transition-all backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                    <Mail
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                      size={20}
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="block text-white/80 text-sm font-medium mb-2">
                    Password
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white/5 border-b-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 transition-all backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={() => navigate("/password-reset")}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Forgot Password
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Register Link */}
                {/* <div className="text-center text-white/80 text-sm">
                Don't have an account?{" "}
                <button className="text-orange-300 hover:text-orange-200 font-medium transition-colors">
                  Register
                </button>
              </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
