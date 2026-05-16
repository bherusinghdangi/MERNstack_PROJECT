import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  Clock, 
  BarChart2, 
  List, 
  TrendingUp, 
  Wallet,
  LogOut,
  User,
  Shield
} from "lucide-react";

const Sidebar = () => {
  const { logout, walletBalance } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Portfolio", path: "/portfolio", icon: <Briefcase size={20} /> },
    { name: "Orders", path: "/orders", icon: <Clock size={20} /> },
    { name: "Reports", path: "/reports", icon: <BarChart2 size={20} /> },
    { name: "Watchlist", path: "/watchlist", icon: <List size={20} /> },
    { name: "Stocks", path: "/stocks", icon: <TrendingUp size={20} /> },
    { name: "Mutual Funds", path: "/mutual-funds", icon: <Wallet size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Security", path: "/security", icon: <Shield size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#111] text-white flex flex-col border-r border-white/10 sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#bef264]">Nexus Invest</h1>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-xs text-white/50 uppercase tracking-wider">Wallet Balance</p>
          <p className="text-xl font-bold text-[#bef264]">₹{walletBalance.toLocaleString()}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-[#bef264] text-black font-semibold"
                : "hover:bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-white/70 hover:text-white hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
