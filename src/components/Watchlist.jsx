import React from "react";
import { Star, TrendingUp, TrendingDown, Trash2 } from "lucide-react";

const Watchlist = () => {
  const watchlist = [
    { id: 1, symbol: "AAPL", name: "Apple Inc.", price: 189.20, change: +1.4 },
    { id: 2, symbol: "TSLA", name: "Tesla, Inc.", price: 245.50, change: -2.1 },
    { id: 3, symbol: "GOOGL", name: "Alphabet Inc.", price: 142.80, change: +0.5 },
    { id: 4, symbol: "MSFT", name: "Microsoft Corp.", price: 378.40, change: +0.2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
        <div className="flex space-x-2">
          <button className="bg-[#bef264] text-black px-4 py-2 rounded-lg text-sm font-bold">+ Add Stock</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((stock) => (
          <div key={stock.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-[#bef264]/50 transition-all group relative">
            <button className="absolute top-6 right-6 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </button>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#bef264]">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-white">{stock.symbol}</h4>
                <p className="text-xs text-white/50">{stock.name}</p>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-tighter mb-1">Last Price</p>
                <p className="text-xl font-bold text-white font-mono">${stock.price.toLocaleString()}</p>
              </div>
              <div className={`flex items-center space-x-1 font-bold ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{stock.change >= 0 ? "+" : ""}{stock.change}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
