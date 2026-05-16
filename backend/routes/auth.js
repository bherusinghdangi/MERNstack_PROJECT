const express = require('express');
const router = express.Router();
const authService = require('../services');
const { requireAuth } = require('../middleware/auth');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword, ...userInfo } = req.body;
    if (!email || !password || !confirmPassword) return res.status(400).json({ error: 'email, password and confirmPassword required' });

    const result = await authService.signup(email, password, confirmPassword, userInfo);
    return res.status(201).json({ message: 'Account created', user: { id: result.id, email: result.email } });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid request' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        error: 'email, password and confirmPassword required'
      });
    }

    const result = await authService.login(email, password, confirmPassword);

    if (result.requires2FA) {
      return res.json({
        requires2FA: true,
        email: result.email
      });
    }
    return res.json({
      token: result.token,
      mustChangePassword: !!result.user.isTempPassword
    });

  } catch (err) {
    const status = err.message === 'Passwords do not match' ? 400 : 401;
    return res.status(status).json({
      error: err.message || 'Invalid credentials'
    });
  }
});

router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword required' });

    await authService.changePassword(userId, currentPassword, newPassword);
    res.json({ message: 'Password changed' });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Unable to change password' });
  }
});

router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await authService.createResetTokenForUser(email);
    res.json({ message: 'If an account exists, password reset instructions were sent.' });
  } catch (err) {
    res.json({ message: 'If an account exists, password reset instructions were sent.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ error: 'email, token, newPassword required' });

    await authService.resetPassword(email, token, newPassword);
    res.json({ message: 'Password has been reset. Please login and change password if required.' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token or request' });
  }
});
router.post('/enable-2fa', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    await authService.enable2FA(userId);

    const io = req.app.get('io');
    io.to(userId.toString()).emit('notification', {
      type: 'VERIFICATION',
      message: 'A 2FA verification code has been sent to your email.'
    });

    res.json({
      message: 'OTP sent to email'
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

router.post('/verify-enable-2fa', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { otp } = req.body;
    await authService.verifyEnable2FA(userId, otp);
    res.json({
      message: '2FA enabled successfully'
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

router.post('/verify-login-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyLoginOTP(email, otp);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

module.exports = router;
