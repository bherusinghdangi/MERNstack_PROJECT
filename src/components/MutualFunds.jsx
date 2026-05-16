import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";

const MutualFunds = () => {
  const navigate = useNavigate();
  const funds = [
    { id: 1, name: "Quant Small Cap Fund", category: "Equity", risk: "Very High", returns: "42.5%", price: 5000 },
    { id: 2, name: "HDFC Index S&P BSE Sensex", category: "Index", risk: "Moderate", returns: "18.2%", price: 10000 },
    { id: 3, name: "ICICI Prudential Bluechip", category: "Large Cap", risk: "Low", returns: "15.4%", price: 2000 },
    { id: 4, name: "Parag Parikh Flexi Cap", category: "Flexi Cap", risk: "Moderate", returns: "24.1%", price: 5000 },
  ];

  const handleInvest = (fund) => {
    navigate("/checkout", { 
      state: { 
        item: { 
          name: fund.name, 
          symbol: fund.category, 
          price: fund.price, 
          type: "Mutual Fund" 
        } 
      } 
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
          <TrendingUp className="text-[#bef264] mb-4" size={32} />
          <h4 className="text-white font-bold mb-1">High Growth</h4>
          <p className="text-white/50 text-sm">Equity funds for long term wealth creation.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
          <ShieldCheck className="text-blue-400 mb-4" size={32} />
          <h4 className="text-white font-bold mb-1">Safe & Steady</h4>
          <p className="text-white/50 text-sm">Debt and Liquid funds for stability.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
          <Zap className="text-orange-400 mb-4" size={32} />
          <h4 className="text-white font-bold mb-1">Tax Savers</h4>
          <p className="text-white/50 text-sm">ELSS funds to save tax under 80C.</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Top Performing Mutual Funds</h3>
        </div>
        <div className="grid grid-cols-1 divide-y divide-white/5">
          {funds.map((fund) => (
            <div key={fund.id} className="p-6 hover:bg-white/5 transition-all flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">{fund.name}</h4>
                <div className="flex gap-3 text-xs">
                  <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded">{fund.category}</span>
                  <span className="text-white/50">Risk: {fund.risk}</span>
                </div>
              </div>
              <div className="text-center md:text-right px-8">
                <div className="text-green-400 font-bold text-lg">{fund.returns}</div>
                <div className="text-white/30 text-xs">3Y Annualised</div>
              </div>
              <div>
                <button 
                  onClick={() => handleInvest(fund)}
                  className="bg-[#bef264] text-black px-8 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  INVEST NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MutualFunds;
