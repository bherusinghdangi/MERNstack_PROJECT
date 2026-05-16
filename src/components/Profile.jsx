import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, MapPin, Phone, Calendar, Shield, CreditCard, ChevronRight, Edit2, Save, X, Image as ImageIcon, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api";
import { useSnackbar } from "notistack";
import { indiaData } from "../data/indiaData";

const Profile = () => {
  const { user, walletBalance, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [availableCities, setAvailableCities] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await API.delete("/api/profile");
      enqueueSnackbar("Account deleted successfully. We're sad to see you go!", { variant: "success" });
      logout();
    } catch (err) {
      console.error("Failed to delete account", err);
      enqueueSnackbar(err.response?.data?.error || "Failed to delete account", { variant: "error" });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/profile");
      setProfile(res.data);
      setFormData(res.data);
      if (res.data.state) {
        setAvailableCities(indiaData[res.data.state] || []);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      enqueueSnackbar("Failed to load profile", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      setAvailableCities(indiaData[value] || []);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/api/profile", formData);
      setProfile(res.data.user);
      setIsEditing(false);
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    } catch (err) {
      console.error("Failed to update profile", err);
      enqueueSnackbar(err.response?.data?.error || "Failed to update profile", { variant: "error" });
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    if (profile?.state) {
      setAvailableCities(indiaData[profile.state] || []);
    }
  };

  if (loading || !profile) {
    return <div className="text-white text-center p-10">Loading Profile...</div>;
  }

  const profileSections = [
    {
      title: "Personal Information",
      items: [
        { label: "Full Name", name: "fullName", value: profile.fullName || "Not set", icon: <User size={18} />, type: "text" },
        { label: "Email Address", name: "email", value: profile.email || "user@example.com", icon: <Mail size={18} />, type: "text", disabled: true },
        { label: "Phone Number", name: "phone", value: profile.phone || "Not set", icon: <Phone size={18} />, type: "text" },
        { label: "Date of Birth", name: "dob", value: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : "", icon: <Calendar size={18} />, type: "date" },
        { label: "State", name: "state", value: profile.state || "Not set", icon: <MapPin size={18} />, type: "select", options: Object.keys(indiaData) },
        { label: "City", name: "city", value: profile.city || "Not set", icon: <MapPin size={18} />, type: "select", options: availableCities },
      ]
    },
    {
      title: "Bio & Appearance",
      items: [
        { label: "Bio", name: "bio", value: profile.bio || "No bio added.", icon: <User size={18} />, type: "textarea" },
        { label: "Profile Image URL", name: "profileImage", value: profile.profileImage || "", icon: <ImageIcon size={18} />, type: "text" },
        { label: "Background Image URL", name: "backgroundImage", value: profile.backgroundImage || "", icon: <ImageIcon size={18} />, type: "text" },
      ]
    },
    {
      title: "Account Settings",
      items: [
        { label: "Account Status", name: "status", value: "Verified", icon: <Shield size={18} />, color: "text-green-400", disabled: true },
        { label: "Membership", name: "membership", value: "Premium Plan", icon: <CreditCard size={18} />, color: "text-[#bef264]", disabled: true },
      ]
    }
  ];

  const defaultBg = "bg-gradient-to-r from-[#bef264]/20 to-blue-500/20";
  const bgStyle = profile.backgroundImage ? { backgroundImage: `url(${profile.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-[32px] border border-white/10 overflow-hidden relative"
      >
        <div className={`h-40 ${!profile.backgroundImage ? defaultBg : ''}`} style={bgStyle} />
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16">
          <div className="w-32 h-32 rounded-2xl bg-[#bef264] flex items-center justify-center text-black text-5xl font-bold shadow-2xl border-4 border-[#111] overflow-hidden relative group">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile.fullName?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"
            )}
            {isEditing && (
               <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon size={24} />
                  <span className="text-xs mt-1 text-center leading-tight">Edit URL<br/>Below</span>
               </div>
            )}
          </div>
          <div className="flex-1 mb-2">
            <h2 className="text-3xl font-bold text-white">{profile.fullName || profile.email}</h2>
            <p className="text-white/50">{profile.email}</p>
            {profile.bio && !isEditing && <p className="text-white/70 mt-2 text-sm max-w-lg">{profile.bio}</p>}
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl border border-white/10 transition-all font-semibold flex items-center gap-2"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          ) : (
             <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-xl border border-red-500/30 transition-all font-semibold flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-[#bef264] hover:bg-[#d9ff99] text-black px-6 py-2 rounded-xl border border-[#bef264] transition-all font-semibold flex items-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
             </div>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <p className="text-white/50 text-sm mb-1 uppercase tracking-wider">Net Worth</p>
            <h3 className="text-2xl font-bold text-[#bef264]">₹{walletBalance.toLocaleString()}</h3>
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Stocks</span>
                <span className="text-white font-medium">₹0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Mutual Funds</span>
                <span className="text-white font-medium">₹0</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <h4 className="text-white font-bold mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white flex items-center justify-between group transition-all">
                <span className="flex items-center gap-3"><Shield size={18} /> Privacy</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white flex items-center justify-between group transition-all">
                <span className="flex items-center gap-3"><CreditCard size={18} /> Billing</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Info Sections */}
        <div className="md:col-span-2 space-y-6">
          {profileSections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">{section.title}</h3>
              </div>
              <div className="p-6 space-y-6">
                {section.items.map((item, i) => (
                  <div key={i} className={`flex ${isEditing && item.type === 'textarea' ? 'flex-col items-start gap-2' : 'items-center'} justify-between group`}>
                    <div className="flex items-center gap-4 w-full">
                      <div className="p-2.5 rounded-xl bg-white/5 text-white/40 group-hover:text-[#bef264] group-hover:bg-[#bef264]/10 transition-all shrink-0">
                        {item.icon}
                      </div>
                      
                      {isEditing && !item.disabled ? (
                        <div className="flex-1">
                          <label className="text-xs text-white/50 mb-1 block">{item.label}</label>
                          {item.type === 'select' ? (
                             <select
                               name={item.name}
                               value={formData[item.name] || ""}
                               onChange={handleChange}
                               className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#bef264] transition-colors"
                             >
                               <option value="" className="text-black">Select {item.label}</option>
                               {item.options?.map(opt => (
                                 <option key={opt} value={opt} className="text-black">{opt}</option>
                               ))}
                             </select>
                          ) : item.type === 'textarea' ? (
                             <textarea
                               name={item.name}
                               value={formData[item.name] || ""}
                               onChange={handleChange}
                               rows={3}
                               className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#bef264] transition-colors resize-y"
                               placeholder={`Enter ${item.label}`}
                             />
                          ) : (
                            <input
                              type={item.type}
                              name={item.name}
                              value={formData[item.name] || ""}
                              onChange={handleChange}
                              placeholder={`Enter ${item.label}`}
                              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#bef264] transition-colors"
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-white/30 font-medium mb-0.5">{item.label}</p>
                          <p className={`font-semibold ${item.color || "text-white/80"} break-all`}>
                            {item.type === 'date' && item.value 
                               ? new Date(item.value).toLocaleDateString() 
                               : item.value || "Not set"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Danger Zone */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-red-500/5 rounded-3xl border border-red-500/20 overflow-hidden"
          >
            <div className="p-6 border-b border-red-500/20 flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
            </div>
            <div className="p-6">
              <p className="text-white/70 text-sm mb-6 max-w-xl">
                Once you delete your account, there is no going back. All of your personal data, holdings, and transaction history will be permanently erased from our servers. Please be certain.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 text-sm shadow-lg shadow-red-500/20"
                >
                  <Trash2 size={16} /> Delete Account
                </button>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                  <p className="text-red-400 font-bold mb-4">Are you absolutely sure you want to delete your account?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-all font-bold flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg transition-all font-bold text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
