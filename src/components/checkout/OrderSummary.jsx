import {
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

function OrderSummary({ item = { name: "Investment Asset", price: 0, type: "Asset" } }) {
    const subtotal = item.price;
    const charges = subtotal * 0.001; // Example 0.1% charges
    const total = subtotal + charges;

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: "28px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                position: "sticky",
                top: 24,
                color: "#fff"
            }}
        >
            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 5,
                    letterSpacing: "-0.5px",
                }}
            >
                Order Summary
            </Typography>

            <Stack spacing={4}>
                <Box>
                    <Typography
                        fontWeight={700}
                        fontSize="1.1rem"
                    >
                        {item.name} ({item.symbol || 'MF'})
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.7,
                            mt: 1,
                        }}
                    >
                        Type: {item.type}
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <Stack spacing={2}>
                    <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between" }}
                    >
                        <Typography sx={{ opacity: 0.7 }}>
                            Subtotal
                        </Typography>

                        <Typography>
                            ₹{subtotal.toLocaleString()}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between" }}
                    >
                        <Typography sx={{ opacity: 0.7 }}>
                            Processing Fee
                        </Typography>

                        <Typography>
                            ₹{charges.toFixed(2)}
                        </Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between" }}
                >
                    <Typography
                        fontWeight={700}
                        fontSize="1.1rem"
                        color="#bef264"
                    >
                        Total Amount
                    </Typography>

                    <Typography
                        fontWeight={700}
                        fontSize="1.1rem"
                        color="#bef264"
                    >
                        ₹{total.toLocaleString()}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

export default OrderSummary;
