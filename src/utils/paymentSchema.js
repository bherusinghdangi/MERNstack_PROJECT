export const paymentSchema = {
    card: {
        number: {
            placeholder: "0000 0000 0000 0000",
            mask: "#### #### #### ####",
        },
        expiry: {
            placeholder: "MM/YY",
            mask: "##/##",
        },
        cvv: {
            placeholder: "000",
            mask: "###",
        },
    },
    upi: {
        vpa: {
            placeholder: "username@bank",
        },
    },
};
