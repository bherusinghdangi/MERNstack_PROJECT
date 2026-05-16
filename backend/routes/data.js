const express = require('express');
const router = express.Router();
const Holding = require('../models/Holding');
const Order = require('../models/Order');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { requireAuth } = require('../middleware/auth');

router.get('/portfolio', requireAuth, async (req, res) => {
    try {
        const holdings = await Holding.find({ userId: req.user._id });
        const user = await User.findById(req.user._id);

        res.status(200).json({
            walletBalance: user.walletBalance || 0,
            holdings: holdings.map(h => ({
                id: h._id,
                symbol: h.symbol,
                name: h.name,
                qty: h.qty,
                avgPrice: h.avgPrice,
                currentPrice: h.avgPrice * (1 + (Math.random() * 0.1 - 0.05)) // Mock current price as +/- 5% of avg
            }))
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

router.post('/orders', requireAuth, async (req, res) => {
    try {
        const { symbol, quantity, price, type } = req.body;
        const numQty = Number(quantity);
        const numPrice = Number(price);
        const totalAmount = numQty * numPrice;

        const user = await User.findById(req.user._id);

        if (type === 'SELL') {
            const holding = await Holding.findOne({ userId: req.user._id, symbol });
            if (!holding || holding.qty < numQty) {
                return res.status(400).json({ error: 'Insufficient quantity to sell' });
            }

            holding.qty -= numQty;
            if (holding.qty === 0) {
                await Holding.deleteOne({ _id: holding._id });
            } else {
                await holding.save();
            }

            user.walletBalance += totalAmount;
            await user.save();
        } else {
            if (user.walletBalance < totalAmount) {
                return res.status(400).json({ error: 'Insufficient wallet balance' });
            }

            let holding = await Holding.findOne({ userId: req.user._id, symbol });
            if (holding) {
                const totalQty = holding.qty + numQty;
                holding.avgPrice = ((holding.avgPrice * holding.qty) + (numPrice * numQty)) / totalQty;
                holding.qty = totalQty;
                await holding.save();
            } else {
                holding = new Holding({
                    userId: req.user._id,
                    symbol,
                    name: symbol,
                    qty: numQty,
                    avgPrice: numPrice
                });
                await holding.save();
            }

            user.walletBalance -= totalAmount;
            await user.save();
        }

        const newOrder = new Order({
            userId: req.user._id,
            symbol,
            qty: numQty,
            price: numPrice,
            type: type || 'BUY',
            status: 'EXECUTED'
        });

        await newOrder.save();

        res.status(200).json({
            message: `Successfully processed ${type || 'BUY'} of ${quantity} ${symbol}`,
            status: "executed",
            walletBalance: user.walletBalance,
            order: newOrder
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process order' });
    }
});


router.post('/deposit', requireAuth, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

        const user = await User.findById(req.user._id);
        user.walletBalance += Number(amount);
        await user.save();

        const transaction = new Transaction({
            userId: req.user._id,
            type: 'DEPOSIT',
            amount: Number(amount)
        });
        await transaction.save();

        res.json({ message: 'Funds deposited successfully', walletBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: 'Deposit failed' });
    }
});

router.post('/withdraw', requireAuth, async (req, res) => {
    try {
        const { amount } = req.body;
        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

        const user = await User.findById(req.user._id);
        if (user.walletBalance < numAmount) {
            return res.status(400).json({ error: 'Insufficient funds for withdrawal' });
        }

        user.walletBalance -= numAmount;
        await user.save();

        const transaction = new Transaction({
            userId: req.user._id,
            type: 'WITHDRAWAL',
            amount: numAmount
        });
        await transaction.save();

        res.json({ message: 'Funds withdrawn successfully', walletBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: 'Withdrawal failed' });
    }
});

router.get('/orders', requireAuth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash -passwordHistory -twoFactorOTPHash');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.put('/profile', requireAuth, async (req, res) => {
    try {
        const { fullName, phone, gender, dob, state, city, bio, profileImage, backgroundImage } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (fullName !== undefined) user.fullName = fullName;
        if (phone !== undefined) user.phone = phone;
        if (gender !== undefined) user.gender = gender;
        if (dob !== undefined) user.dob = dob;
        if (state !== undefined) user.state = state;
        if (city !== undefined) user.city = city;
        if (bio !== undefined) user.bio = bio;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (backgroundImage !== undefined) user.backgroundImage = backgroundImage;

        await user.save();

        const updatedUser = await User.findById(req.user._id).select('-passwordHash -passwordHistory -twoFactorOTPHash');
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.delete('/profile', requireAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        await Order.deleteMany({ userId });
        await Holding.deleteMany({ userId });
        await Transaction.deleteMany({ userId });
        await User.deleteOne({ _id: userId });
        
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error("Account deletion error:", err);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

module.exports = router;