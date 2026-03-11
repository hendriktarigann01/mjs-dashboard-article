import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../lib/api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
    if (!formData.password.trim()) newErrors.password = "Password wajib diisi";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);
    } catch (err) {
      const msg = err.response?.data?.message || "Login gagal. Coba lagi.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-10">
        {/* Logo */}
        <div className="text-center my-10">
          <img src="/mjs-logo-text.png" alt="Logo" className="h-11 mx-auto" />
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-primary text-2xl font-medium mb-3">Login</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Thank you for get back to{" "}
            <span className="text-primary font-medium">
              MJ Solution Photobooth
            </span>
          </p>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email or Username"
              className={`w-full px-4 py-3 border rounded-md text-sm placeholder-gray-400
                focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 border rounded-md text-sm placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                  ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed
              text-white text-sm py-3 rounded-md transition duration-150 font-medium tracking-wider mt-8"
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-primary mt-14">
          By MJ Solution Indonesia
        </p>
      </div>
    </div>
  );
};

export default Login;
