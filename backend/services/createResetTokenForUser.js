const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require("./utils");
const { getResetPasswordEmailTemplate } = require("./emailTemplate");

const RESET_TOKEN_EXPIRES_MIN = parseInt(process.env.RESET_TOKEN_EXPIRES_MIN || '60', 10);

async function createResetTokenForUser(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenHash = crypto.createHash('sha256').update(otp).digest('hex');

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000);
  user.isTempPassword = true;
  await user.save();

  const link = `${process.env.CLIENT_URL}/reset-password`;
  const html = getResetPasswordEmailTemplate(user.email, link, otp);
  await sendEmail(user.email, 'Password Reset Verification Code', `Your password reset code is: ${otp}`, html);

  return;
}
module.exports = createResetTokenForUser;