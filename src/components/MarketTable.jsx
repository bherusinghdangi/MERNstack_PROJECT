import React from "react";
import { useNavigate } from "react-router-dom";

const MarketTable = () => {
  const navigate = useNavigate();
  const stocks = [
    { id: 1, symbol: "RELIANCE", name: "Reliance Industries", price: 2845.50, change: +1.2 },
    { id: 2, symbol: "TCS", name: "Tata Consultancy Services", price: 3450.20, change: -0.5 },
    { id: 3, symbol: "HDFCBANK", name: "HDFC Bank", price: 1540.80, change: +0.8 },
    { id: 4, symbol: "INFY", name: "Infosys Ltd", price: 1420.30, change: -1.4 },
    { id: 5, symbol: "ICICIBANK", name: "ICICI Bank", price: 950.40, change: +2.1 },
    { id: 6, symbol: "ADANIENT", name: "Adani Enterprises", price: 2450.00, change: +5.4 },
  ];

  const handleBuy = (stock) => {
    navigate("/checkout", { 
      state: { 
        item: { 
          name: stock.name, 
          symbol: stock.symbol, 
          price: stock.price, 
          type: "Stock" 
        } 
      } 
    });
  };

  return (
    <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Market Overview</h3>
        <button className="text-[#bef264] text-sm font-semibold hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">Change</th>
              <th className="px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {stocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-white/5 transition-all group">
                <td className="px-6 py-4">
                  <span className="font-bold group-hover:text-[#bef264] transition-colors">{stock.symbol}</span>
                </td>
                <td className="px-6 py-4 text-white/70">{stock.name}</td>
                <td className="px-6 py-4 text-right font-medium font-mono text-[#bef264]">₹{stock.price.toLocaleString()}</td>
                <td className={`px-6 py-4 text-right font-bold ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {stock.change >= 0 ? "+" : ""}{stock.change}%
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleBuy(stock)}
                    className="bg-[#bef264] text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all"
                  >
                    BUY
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;
