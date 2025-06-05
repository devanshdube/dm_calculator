import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import img1 from "../assets/79dd5e221567809.67d70a7ee99ae.jpg";
// import img1 from "../assets/o81a6yh5lz1e1.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //   const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${img1})`,
          backgroundColor: "#FF6B47",
        }}
      >
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl relative">
            {/* Close Button */}
            {/* <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <X size={20} />
            </button> */}

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                {/* <div
                  className="flex items-center space-x-2 text-white/80 cursor-pointer"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-orange-500 focus:ring-orange-400 focus:ring-2"
                  />
                  <span>Remember me</span>
                </div> */}
                <button className="text-white/80 hover:text-white transition-colors">
                  Forgot Password
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Login
              </button>

              {/* Register Link */}
              {/* <div className="text-center text-white/80 text-sm">
                Don't have an account?{" "}
                <button className="text-orange-300 hover:text-orange-200 font-medium transition-colors">
                  Register
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
