import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, PieChart, Plus } from "lucide-react";
import API from "../api";
import { useSnackbar } from "notistack";
import PaymentUI from "./PaymentUI";
import { useAuth } from "../context/AuthContext";

const Portfolio = () => {
  const { refreshBalance } = useAuth();
  const [data, setData] = useState({ holdings: [], walletBalance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchPortfolio = async () => {
    try {
      const response = await API.get("/api/portfolio");
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch portfolio data. Please login.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSell = async (symbol, qty, price) => {
    try {
      await API.post("/api/orders", {
        symbol,
        quantity: 1,
        price: price,
        type: 'SELL'
      });
      enqueueSnackbar(`Successfully sold 1 share of ${symbol}`, { variant: "success" });
      refreshBalance();
      fetchPortfolio();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.error || "Sell failed", { variant: "error" });
    }
  };

  if (loading) return <div className="text-white text-center p-10">Loading Portfolio...</div>;
  if (error) return <div className="text-red-400 text-center p-10">{error}</div>;

  const { holdings, walletBalance } = data;

  const totalInvestment = holdings.reduce((acc, curr) => acc + (curr.qty * curr.avgPrice), 0);
  const currentValuation = holdings.reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);
  const totalReturns = currentValuation - totalInvestment;
  const returnPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Portfolio</h1>
        <button
          onClick={() => setShowAddFunds(!showAddFunds)}
          className="bg-[#bef264] text-black font-bold px-6 py-2 rounded-xl flex items-center space-x-2 hover:opacity-90 transition-all"
        >
          <Plus size={18} />
          <span>{showAddFunds ? "Close" : "Manage Funds"}</span>
        </button>
      </div>

      {showAddFunds && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <PaymentUI />
          <div className="mt-8 border-b border-white/10"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex items-center space-x-3 mb-4 text-white/50">
            <Wallet size={18} />
            <span className="text-sm font-medium uppercase tracking-wider">Wallet Balance</span>
          </div>
          <p className="text-3xl font-bold text-[#bef264]">₹{walletBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex items-center space-x-3 mb-4 text-white/50">
            <PieChart size={18} />
            <span className="text-sm font-medium uppercase tracking-wider">Current Value</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{currentValuation.toLocaleString()}</p>
        </div>

        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex items-center space-x-3 mb-4 text-white/50">
            {totalReturns >= 0 ? <TrendingUp size={18} className="text-green-400" /> : <TrendingDown size={18} className="text-red-400" />}
            <span className="text-sm font-medium uppercase tracking-wider">Total Returns</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${totalReturns >= 0 ? "text-green-400" : "text-red-400"}`}>
              ₹{totalReturns.toLocaleString()}
            </p>
            <span className={`text-sm font-bold ${totalReturns >= 0 ? "text-green-400" : "text-red-400"}`}>
              ({returnPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">My Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead className="bg-white/5 text-white/50 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4 text-right">Avg Price</th>
                <th className="px-6 py-4 text-right">Current Price</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {holdings.map((item) => {
                const profit = (item.currentPrice - item.avgPrice) * item.qty;
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-all">
                    <td className="px-6 py-4 font-bold">{item.symbol}</td>
                    <td className="px-6 py-4">{item.qty}</td>
                    <td className="px-6 py-4 text-right">₹{item.avgPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">₹{item.currentPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSell(item.symbol, item.qty, item.currentPrice)}
                        className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                      >
                        SELL
                      </button>
                    </td>
                  </tr>
                );
              })}
              {holdings.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-white/50">No holdings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
