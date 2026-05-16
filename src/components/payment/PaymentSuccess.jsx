import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../context/PaymentContext";

function PaymentSuccess({ open }) {
  const navigate = useNavigate();
  const { dispatch } = usePayment();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch({ type: "RESET_PAYMENT" });
        navigate("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [open, navigate, dispatch]);

  return (
    <Dialog 
      open={open} 
      onClose={() => {
        dispatch({ type: "RESET_PAYMENT" });
        navigate("/dashboard");
      }}
      // Use sx instead of PaperProps to avoid DOM warnings in some environments
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
          borderRadius: "32px",
        }
      }}
    >
      <DialogContent
        sx={{
          textAlign: "center",
          p: 5,
          background: "linear-gradient(135deg, #111827, #1e293b)",
          borderRadius: "32px",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <CheckCircle size={80} color="#bef264" style={{ margin: "0 auto" }} />
        </motion.div>

        <Typography
          variant="h5"
          mt={3}
          fontWeight={700}
        >
          Payment Successful
        </Typography>

        <Typography
          mt={2}
          sx={{ opacity: 0.7 }}
        >
          Your transaction has been completed successfully. Redirecting to dashboard...
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentSuccess;
