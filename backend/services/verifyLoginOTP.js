const crypto = require('crypto');
const User = require('../models/User');
const { generateJWT, sendEmail } = require("./utils");
const { getVerificationCompletedEmailTemplate } = require("./emailTemplate");

async function verifyLoginOTP(email, otp) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

  if (user.twoFactorOTPHash !== otpHash) {
    throw new Error('Invalid OTP');
  }

  if (user.twoFactorOTPExpires < Date.now()) {
    throw new Error('OTP expired');
  }

  user.twoFactorOTPHash = null;
  user.twoFactorOTPExpires = null;
  user.lastLogin = new Date();
  await user.save();

  try {
    const htmlContent = getVerificationCompletedEmailTemplate(user.fullName, user.email);
    await sendEmail(user.email, "Security Notification: Verification Completed", htmlContent);
  } catch (emailErr) {
    console.error("Failed to send verification completion email", emailErr);
  }

  const token = generateJWT(user);
  return {
    token
  };
}

module.exports = verifyLoginOTP;