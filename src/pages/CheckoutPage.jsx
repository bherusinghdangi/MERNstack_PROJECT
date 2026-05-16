import { Box } from "@mui/material";
import PaymentSection from "../components/payment/PaymentSection";
import OrderSummary from "../components/checkout/OrderSummary";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

function CheckoutPage() {
    const location = useLocation();
    const item = location.state?.item || { name: "Investment Asset", price: 0, type: "Asset" };

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.5,
            }}
            className="w-full"
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "1.4fr 0.8fr",
                    },
                    gap: {
                        xs: 3,
                        md: 4,
                    },
                    alignItems: "start",
                }}
            >
                <PaymentSection item={item} />
                <OrderSummary item={item} />
            </Box>
        </motion.div>
    );
}

export default CheckoutPage;
