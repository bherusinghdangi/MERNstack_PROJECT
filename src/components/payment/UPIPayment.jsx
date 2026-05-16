import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { upiApps } from "../../data/upiApps";
import { usePayment } from "../../context/PaymentContext";
import { QRCodeSVG } from "qrcode.react";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

function UPIPayment({ item }) {
  const { refreshBalance } = useAuth();
  const [selectedApp, setSelectedApp] = useState("gpay");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = usePayment();

  // Generate a mock UPI URI for the QR code
  const upiUri = `upi://pay?pa=nexusinvest@upi&pn=NexusInvest&am=${item?.price || 0}&cu=INR`;

  const handleUPIPayment = async () => {
    setLoading(true);
    dispatch({ type: "SET_PROCESSING", payload: true });

    try {
        // Process the order in the backend
        await API.post("/api/orders", {
            symbol: item.symbol,
            quantity: 1,
            price: item.price,
            type: 'BUY'
        });

        refreshBalance();
        dispatch({ type: "PAYMENT_SUCCESS" });
        enqueueSnackbar(`Payment verified and stock purchased!`, { variant: "success" });
    } catch (err) {
        enqueueSnackbar(err.response?.data?.error || "Transaction failed", { variant: "error" });
        dispatch({ type: "SET_PROCESSING", payload: false });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, borderRadius: "28px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", color: "#fff", textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Scan to Pay</Typography>
      <Typography sx={{ mb: 4, opacity: 0.7 }}>Scan the QR code using any UPI app</Typography>

      <Box sx={{ 
        background: '#fff', 
        p: 3, 
        borderRadius: '24px', 
        display: 'inline-block',
        mb: 4,
        boxShadow: '0 0 20px rgba(190, 242, 100, 0.3)'
      }}>
        <QRCodeSVG 
          value={upiUri} 
          size={200}
          fgColor="#000"
          bgColor="#fff"
        />
      </Box>

      <Stack direction="row" spacing={2} sx={{ justifyContent: "center", mb: 4 }} flexWrap="wrap" useFlexGap>
        {upiApps.slice(0, 3).map((app) => (
          <Box
            key={app.id}
            sx={{
              p: 1.5,
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
             <Box sx={{ width: 24, height: 24, borderRadius: "6px", background: "#bef264", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.7rem" }}>
                  {app.name.charAt(0)}
                </Box>
            <Typography variant="caption" fontWeight={600}>{app.name}</Typography>
          </Box>
        ))}
      </Stack>

      <Button
        fullWidth
        variant="contained"
        disabled={loading}
        onClick={handleUPIPayment}
        sx={{ py: 1.6, fontWeight: 700, background: "#bef264", color: "#000", "&:hover": { background: "#d9ff99" } }}
      >
        {loading ? "Verifying Transaction..." : "I Have Paid"}
      </Button>
      
      <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.5 }}>
        Transaction will be automatically verified after payment
      </Typography>
    </Box>
  );
}

export default UPIPayment;
