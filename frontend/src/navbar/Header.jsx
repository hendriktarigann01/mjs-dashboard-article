import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, X, Eye, EyeOff } from "lucide-react";
import api from "../lib/api";

const Header = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const profileIcon =
    user.gender === "female"
      ? "/icon-profile-girl.png"
      : "/icon-profile-boy.png";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {
      // Tetap logout meski request gagal
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua field wajib diisi");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    try {
      await api.put("/auth/edit-profile", { currentPassword, newPassword });
      setPasswordSuccess("Password berhasil diubah");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Gagal mengubah password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky z-50 top-0">
        <div className="flex justify-between items-center h-16 mx-4 md:mx-10">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/mjs-logo-text.png" alt="Logo" className="h-10" />
          </div>

          <div className="flex items-center space-x-6">
            {/* Mobile toggle */}
            <button
              onClick={onMenuToggle}
              className="flex items-center space-x-2 border rounded-full px-3 py-1 shadow-sm md:hidden"
            >
              <span className="text-xl">&#9776;</span>
              <img
                src={profileIcon}
                alt="User"
                className="w-6 h-6 rounded-full object-cover"
              />
            </button>

            {/* Desktop dropdown */}
            <div className="relative hidden md:flex items-center space-x-2">
              <img
                src={profileIcon}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <ChevronDown className="text-gray-500 h-5 w-5" />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-md rounded-md border w-52 z-50">
                  {/* User info */}
                  <div className="flex items-center text-sm px-4 py-5 gap-x-2">
                    <img
                      src={profileIcon}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-[#414853] font-medium text-sm truncate">
                        {user.name || user.username || "User"}
                      </p>
                      <p className="text-[#9E9E9E] text-xs truncate">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>

                  <hr />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowPasswordModal(true);
                    }}
                    className="flex items-center w-full text-left text-[#9E9E9E] px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    <img
                      src="/icons/lock.svg"
                      alt="Lock"
                      className="w-4 h-4 mr-2"
                    />
                    Change Password
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left text-[#F25961] px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    <img
                      src="/icons/logout.svg"
                      alt="Logout"
                      className="w-4 h-4 mr-2"
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#414853]">
                Change Password
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success */}
            {passwordSuccess && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
                {passwordSuccess}
              </div>
            )}

            {/* Error */}
            {passwordError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              {[
                {
                  label: "Current Password",
                  name: "currentPassword",
                  key: "current",
                },
                { label: "New Password", name: "newPassword", key: "new" },
                {
                  label: "Confirm New Password",
                  name: "confirmPassword",
                  key: "confirm",
                },
              ].map(({ label, name, key }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass[key] ? "text" : "password"}
                      name={name}
                      value={passwordForm[name]}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                      placeholder={label}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPass[key] ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-md hover:bg-gray-50 transition"
              >
               Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="flex-1 bg-[#3AAFA9] text-white text-sm py-2 rounded-md hover:bg-teal-700 transition disabled:opacity-50"
              >
                {passwordLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
