import React, { useState } from "react";
import { CreditCard, Wallet, Landmark, CheckCircle } from "lucide-react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";


const PaymentUI = () => {
  const { refreshBalance } = useAuth();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("deposit");
  const { enqueueSnackbar } = useSnackbar();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const endpoint = transactionType === "deposit" ? "/api/deposit" : "/api/withdraw";
      const res = await API.post(endpoint, { amount: parseFloat(amount) });
      const actionText = transactionType === "deposit" ? "added to" : "withdrawn from";
      enqueueSnackbar(`₹${amount} ${actionText} your wallet!`, { variant: "success" });
      refreshBalance();
      setIsSuccess(true);
      setAmount("");
    } catch (err) {
      enqueueSnackbar(err.response?.data?.error || "Transaction failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {transactionType === "deposit" ? "Funds Added Successfully!" : "Funds Withdrawn Successfully!"}
        </h3>
        <p className="text-white/50 mb-8">Your real-time wallet balance has been updated.</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-[#bef264] text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all"
        >
          {transactionType === "deposit" ? "Add More Funds" : "Withdraw More Funds"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">

      <div className="flex bg-white/5 p-1 rounded-xl mb-8">
        <button
          type="button"
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${transactionType === 'deposit' ? 'bg-[#bef264] text-black shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          onClick={() => setTransactionType('deposit')}
        >
          Deposit Funds
        </button>
        <button
          type="button"
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${transactionType === 'withdraw' ? 'bg-red-400 text-black shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          onClick={() => setTransactionType('withdraw')}
        >
          Withdraw Funds
        </button>
      </div>

      <form onSubmit={handlePayment} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-white/50 mb-3 uppercase tracking-wider">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full bg-white/5 border-b-2 border-white/10 text-4xl font-bold py-4 focus:outline-none transition-all placeholder:text-white/10 ${transactionType === 'deposit' ? 'text-[#bef264] focus:border-[#bef264]' : 'text-red-400 focus:border-red-400'}`}
            placeholder="0.00"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">
            {transactionType === "deposit" ? "Select Deposit Method" : "Select Withdrawal Method"}
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "card", label: "Card", icon: <CreditCard size={24} /> },
              { id: "upi", label: "UPI", icon: <Wallet size={24} /> },
              { id: "net", label: "Net Banking", icon: <Landmark size={24} /> },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${method === item.id
                    ? (transactionType === 'deposit' ? "bg-[#bef264] border-[#bef264] text-black" : "bg-red-400 border-red-400 text-black")
                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {item.icon}
                <span className="text-xs font-bold mt-2">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 ${transactionType === 'deposit' ? 'bg-white hover:bg-[#bef264]' : 'bg-white hover:bg-red-400'}`}
        >
          <span>{loading ? "Processing..." : (transactionType === "deposit" ? "Confirm Payment" : "Confirm Withdrawal")}</span>
        </button>
      </form>
    </div>
  );
};

export default PaymentUI;
