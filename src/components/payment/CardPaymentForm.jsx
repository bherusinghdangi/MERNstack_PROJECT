import {
    Box,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import CreditCardPreview from "./CreditCardPreview";
import { usePayment } from "../../context/PaymentContext";
import { useState } from "react";
import { useSnackbar } from "notistack";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

function CardPaymentForm({ item }) {
    const { refreshBalance } = useAuth();
    const { state, dispatch } = usePayment();
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 4);
        if (cleaned.length >= 2) {
            const month = cleaned.slice(0, 2);
            if (Number(month) > 12) return "12";
        }
        if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        return cleaned;
    };

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 16);
        return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "cardNumber") formattedValue = formatCardNumber(value);
        if (name === "expiry") formattedValue = formatExpiry(value);
        if (name === "cvv") formattedValue = value.replace(/\D/g, "").slice(0, 3);
        if (name === "cardName") formattedValue = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();

        setForm(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv) {
            enqueueSnackbar("Please fill all card details", { variant: "error" });
            return;
        }

        dispatch({ type: "SET_PROCESSING", payload: true });

        try {
            // Process the order in the backend
            await API.post("/api/orders", {
                symbol: item.symbol,
                quantity: 1, // Defaulting to 1 for now
                price: item.price,
                type: 'BUY'
            });

            refreshBalance();
            dispatch({ type: "PAYMENT_SUCCESS" });
            enqueueSnackbar("Purchase completed successfully!", { variant: "success" });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.error || "Transaction failed", { variant: "error" });
            dispatch({ type: "SET_PROCESSING", payload: false });
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", backdropFilter: "blur(10px)", color: "#fff" }}>
            <Box mb={4}>
                <CreditCardPreview cardName={form.cardName} cardNumber={form.cardNumber} expiry={form.expiry} cardType="VISA" />
            </Box>

            <Typography variant="h6" fontWeight={700} sx={{ mt: 1, mb: 3, opacity: 0.95 }}>Card Details</Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
                <TextField fullWidth label="Card Holder Name" name="cardName" value={form.cardName} onChange={handleChange} sx={fieldStyle} />
                <TextField fullWidth label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} sx={fieldStyle} />
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField fullWidth label="Expiry" name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} sx={fieldStyle} />
                    <TextField fullWidth label="CVV" name="cvv" type="password" value={form.cvv} onChange={handleChange} sx={fieldStyle} />
                </Box>

                <Button type="submit" fullWidth variant="contained" size="large" disabled={state.processing} sx={{ mt: 2, py: 1.5, borderRadius: "14px", background: "#bef264", color: "#000", fontWeight: 700, "&:hover": { background: "#d9ff99" } }}>
                    {state.processing ? "Processing..." : "Confirm Payment"}
                </Button>
            </Box>
        </Box>
    );
}

const fieldStyle = {
    "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#bef264" }, "&.Mui-focused fieldset": { borderColor: "#bef264" } },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
    "& .MuiOutlinedInput-input": { color: "#fff" }
};

export default CardPaymentForm;
