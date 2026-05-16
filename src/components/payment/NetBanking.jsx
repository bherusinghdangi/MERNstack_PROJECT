import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
} from "@mui/material";
import { useState } from "react";
import { usePayment } from "../../context/PaymentContext";
import { useSnackbar } from "notistack";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

const banks = [
    { id: "sbi", name: "State Bank of India" },
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "axis", name: "Axis Bank" },
    { id: "kotak", name: "Kotak Bank" },
    { id: "pnb", name: "Punjab National Bank" }
];

function NetBanking({ item }) {
    const { refreshBalance } = useAuth();
    const [selectedBank, setSelectedBank] = useState("");
    const { state, dispatch } = usePayment();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        if (!selectedBank) {
            enqueueSnackbar("Please select a bank", { variant: "warning" });
            return;
        }

        dispatch({ type: "SET_PROCESSING", payload: true });

        try {
            await API.post("/api/orders", {
                symbol: item.symbol,
                quantity: 1,
                price: item.price,
                type: 'BUY'
            });

            refreshBalance();
            dispatch({ type: "PAYMENT_SUCCESS" });
            enqueueSnackbar("Net Banking payment successful!", { variant: "success" });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.error || "Transaction failed", { variant: "error" });
            dispatch({ type: "SET_PROCESSING", payload: false });
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Select Your Bank</Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {banks.map((bank) => (
                    <Grid item xs={6} sm={4} key={bank.id}>
                        <Paper
                            onClick={() => setSelectedBank(bank.id)}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                borderRadius: "12px",
                                background: selectedBank === bank.id ? "rgba(190, 242, 100, 0.1)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${selectedBank === bank.id ? "#bef264" : "rgba(255,255,255,0.1)"}`,
                                color: selectedBank === bank.id ? "#bef264" : "#fff",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    background: "rgba(255,255,255,0.08)"
                                }
                            }}
                        >
                            <Typography variant="body2" fontWeight={600}>{bank.name}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={state.processing}
                onClick={handleSubmit}
                sx={{ py: 1.5, borderRadius: "14px", background: "#bef264", color: "#000", fontWeight: 700, "&:hover": { background: "#d9ff99" } }}
            >
                {state.processing ? "Redirecting to Bank..." : "Proceed to Pay"}
            </Button>
        </Box>
    );
}

export default NetBanking;
