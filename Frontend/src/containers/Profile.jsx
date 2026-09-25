import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import {
  User,
  Mail,
  Phone,
  Camera,
  MapPin,
  Package,
  ShoppingBag,
  LogOut,
  Save,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Loader2,
  Trash2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

function Profile() {
  const {
    token,
    user,
    setUser,
    profileImage,
    setProfileImage,
    updateUserProfile,
    fetchUserProfile,
    orders,
    cartItem,
    getCartCount,
    role,
    deliveryAddress,
    updateDeliveryAddress,
    logoutUser,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form states
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Image states
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Loading states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState("overview"); // overview, address, security

  // Preset avatar choices
  const presetAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  ];

  // Initialize fields
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      if (user.image) {
        setImagePreview(user.image);
      }
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUsername(parsed.username || "");
          setEmail(parsed.email || "");
          setPhone(parsed.phone || "");
          if (parsed.image) setImagePreview(parsed.image);
        } catch (e) {}
      }
    }

    if (profileImage) {
      setImagePreview(profileImage);
    }

    if (deliveryAddress) {
      setAddressForm({
        fullName: deliveryAddress.fullName || "",
        phone: deliveryAddress.phone || "",
        street: deliveryAddress.street || "",
        city: deliveryAddress.city || "",
        state: deliveryAddress.state || "",
        zipCode: deliveryAddress.zipCode || "",
        country: deliveryAddress.country || "United States",
      });
    }
  }, [user, profileImage, deliveryAddress]);

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastr.error("Image file size must be less than 5MB");
      return;
    }

    // Read and create preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Save selected photo (either file or preset/URL)
  const handleSavePhoto = async (overrideUrl = null) => {
    const targetUrl = overrideUrl || customImageUrl;
    setIsUploadingPhoto(true);

    try {
      if (selectedFile) {
        // Upload with FormData
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("username", username);

        const res = await updateUserProfile(formData);
        if (res?.success) {
          toastr.success("Profile photo updated successfully!");
          setSelectedFile(null);
        }
      } else if (targetUrl) {
        // Direct URL or preset
        setImagePreview(targetUrl);
        setProfileImage(targetUrl);
        localStorage.setItem("userImage", targetUrl);

        const res = await updateUserProfile({ image: targetUrl });
        if (res?.success) {
          toastr.success("Profile photo updated successfully!");
          setCustomImageUrl("");
          setShowUrlInput(false);
        }
      } else if (imagePreview) {
        // Base64 or cached image
        setProfileImage(imagePreview);
        localStorage.setItem("userImage", imagePreview);
        await updateUserProfile({ image: imagePreview });
        toastr.success("Profile photo saved!");
        setSelectedFile(null);
      }
    } catch (err) {
      toastr.error("Could not update photo. Saved locally.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Remove photo
  const handleRemovePhoto = async () => {
    setImagePreview("");
    setSelectedFile(null);
    setProfileImage("");
    localStorage.removeItem("userImage");
    if (user) {
      const updated = { ...user, image: "" };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
    await updateUserProfile({ image: "" });
    toastr.info("Profile photo removed. Using default avatar.");
  };

  // Save basic profile info (username, phone)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toastr.warning("Username cannot be empty");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateUserProfile({
        username: username.trim(),
        phone: phone.trim(),
        image: imagePreview || profileImage || "",
      });

      if (res?.success) {
        toastr.success("Profile information updated!");
      }
    } catch (err) {
      toastr.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save delivery address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      updateDeliveryAddress(addressForm);
      updateUserProfile({ address: addressForm });
      toastr.success("Delivery address saved successfully!");
    } catch (err) {
      toastr.error("Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Unauthenticated view
  const activeToken = token || localStorage.getItem("token");
  if (!activeToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xl max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">You are not logged in</h2>
          <p className="text-sm text-slate-500 mt-2">
            Sign in or create an account to view and customize your GreenCart profile, manage your delivery address, and view past orders.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="flex-1 bg-[#4fbf8b] hover:bg-[#43a678] text-white py-3 px-6 rounded-xl font-medium transition shadow-md shadow-emerald-600/20"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-xl font-medium transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentRole = role || user?.role || localStorage.getItem("role") || "user";
  const isAdmin = currentRole === "admin";
  const displayAvatar = imagePreview || profileImage || user?.image || "/images/profile.png";

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-8 sm:p-10 text-white shadow-xl shadow-emerald-900/10">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            {/* Main Avatar */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-white/30 backdrop-blur-md shadow-2xl">
                <div className="w-full h-full rounded-[22px] bg-white overflow-hidden flex items-center justify-center">
                  <img
                    src={displayAvatar}
                    alt={username || "User avatar"}
                    onError={(e) => { e.target.src = "/images/profile.png"; }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-white text-emerald-700 p-2.5 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                title="Change photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info and Badges */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {username || "GreenCart Shopper"}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  {isAdmin ? "Admin Member" : "Verified Customer"}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 backdrop-blur-md text-emerald-100 border border-emerald-300/30">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  Eco-Rewards Active
                </span>
              </div>
              <p className="text-emerald-100/90 text-sm max-w-xl">
                {email || "User profile"} • Manage your account preferences, profile picture, and saved delivery address for 1-click checkout.
              </p>

              {/* Quick stats chips */}
              <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs">
                  <span className="text-emerald-100">Orders Placed:</span>{" "}
                  <strong className="text-white font-bold ml-1">{orders?.length || 0}</strong>
                </div>
                <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs">
                  <span className="text-emerald-100">Items in Cart:</span>{" "}
                  <strong className="text-white font-bold ml-1">{getCartCount ? getCartCount() : 0}</strong>
                </div>
                <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs">
                  <span className="text-emerald-100">Green Rewards:</span>{" "}
                  <strong className="text-white font-bold ml-1">120 pts</strong>
                </div>
              </div>
            </div>

            {/* Logout Shortcut */}
            <div className="shrink-0 self-center md:self-start">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#4fbf8b] text-white shadow-md shadow-emerald-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Profile & Photo
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "address"
                ? "bg-[#4fbf8b] text-white shadow-md shadow-emerald-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Delivery Address
          </button>
          <Link
            to="/orders"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <span>My Orders</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Tab 1: Profile & Photo */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Photo Customizer Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    Profile Picture
                  </h2>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Big Preview */}
                <div className="py-6 flex flex-col items-center text-center">
                  <div className="relative w-36 h-36 rounded-3xl p-1 bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 shadow-md">
                    <div className="w-full h-full rounded-[20px] bg-white overflow-hidden">
                      <img
                        src={displayAvatar}
                        alt="Current Profile"
                        onError={(e) => { e.target.src = "/images/profile.png"; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center backdrop-blur-xs">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Supported: JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                {/* Photo Actions */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload Image from Device</span>
                  </button>

                  {/* Save button if file chosen */}
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => handleSavePhoto()}
                      disabled={isUploadingPhoto}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 disabled:opacity-75 cursor-pointer"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving image...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Selected Photo</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Toggle Direct Image URL Input */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-xs text-slate-500 hover:text-emerald-600 font-medium underline transition cursor-pointer"
                    >
                      {showUrlInput ? "Hide URL input" : "Or use an Image URL"}
                    </button>

                    {showUrlInput && (
                      <div className="mt-2 space-y-2">
                        <input
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 outline-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSavePhoto(customImageUrl)}
                          disabled={!customImageUrl.trim() || isUploadingPhoto}
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition disabled:opacity-50 cursor-pointer"
                        >
                          Apply Image URL
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Preset Avatars */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Or choose an avatar
                    </p>
                    <div className="flex items-center gap-2.5">
                      {presetAvatars.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSavePhoto(url)}
                          className="w-10 h-10 rounded-full overflow-hidden border-2 hover:border-emerald-500 transition-all hover:scale-110 cursor-pointer shrink-0"
                          title="Use preset avatar"
                        >
                          <img src={url} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                Your photo appears in the top navigation bar and on order receipts.
              </div>
            </div>

            {/* Profile Information Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Account Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Update your contact details and display name.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name / Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="John Doe"
                        className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={email}
                        placeholder="email@example.com"
                        className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Email is tied to your account authentication and cannot be changed.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Account Role
                    </label>
                    <div className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-600 flex items-center justify-between">
                      <span className="capitalize font-medium">{currentRole}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {isAdmin ? "Store Admin" : "Customer"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-[#4fbf8b] hover:bg-[#43a678] text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick links banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <Link
                  to="/orders"
                  className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">My Orders</p>
                      <p className="text-xs text-slate-500">Track and view order history</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/cart"
                  className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 hover:bg-teal-50 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-100 rounded-xl text-teal-700">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Shopping Cart</p>
                      <p className="text-xs text-slate-500">{getCartCount ? getCartCount() : 0} items waiting</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Delivery Address */}
        {activeTab === "address" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-sm max-w-3xl space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Default Delivery Address
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                This address will be automatically populated during your checkout process.
              </p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder="Recipient Name"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Street Address / Apartment / Suite
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="742 Evergreen Terrace, Apt 4B"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Springfield"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="Oregon"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    placeholder="97477"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    placeholder="United States"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="bg-[#4fbf8b] hover:bg-[#43a678] text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSavingAddress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Address...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Address</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
