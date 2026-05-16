import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import { CreditCard, Wallet, Landmark } from "lucide-react";
import { usePayment } from "../../context/PaymentContext";

const methods = [
    {
        id: "card",
        label: "Card",
        icon: <CreditCard size={20} />,
    },
    {
        id: "upi",
        label: "UPI",
        icon: <Wallet size={20} />,
    },
    {
        id: "banking",
        label: "Net Banking",
        icon: <Landmark size={20} />,
    },
];

function PaymentMethods() {
    const { state, dispatch } = usePayment();

    return (
        <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
        >
            {methods.map((method) => {
                const active =
                    state.selectedMethod === method.id;

                return (
                    <Box
                        key={method.id}
                        onClick={() =>
                            dispatch({
                                type: "SET_METHOD",
                                payload: method.id,
                            })
                        }
                        sx={{
                            flex: 1,
                            minWidth: "140px",
                            p: 2,
                            borderRadius: "18px",
                            cursor: "pointer",
                            transition: "0.3s ease",
                            background: active
                                ? "rgba(190, 242, 100, 0.2)"
                                : "rgba(255,255,255,0.06)",
                            border: active
                                ? "1px solid #bef264"
                                : "1px solid rgba(255,255,255,0.1)",
                            transform: active
                                ? "translateY(-4px)"
                                : "translateY(0px)",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                background: "rgba(255,255,255,0.12)",
                            },
                            backdropFilter: "blur(12px)",
                            color: active ? "#bef264" : "#fff",
                        }}
                    >
                        <Stack
                            spacing={1}
                            alignItems="center"
                        >
                            {method.icon}
                            <Typography fontWeight={600}>
                                {method.label}
                            </Typography>
                        </Stack>
                    </Box>
                );
            })}
        </Stack>
    );
}

export default PaymentMethods;
