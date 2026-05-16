const User = require('../models/User');
const { validatePasswordRules, hashPassword, sendEmail, comparePassword } = require("./utils")

const PASSWORD_HISTORY_LIMIT = 5;

async function changePassword(userId, currentPassword, newPassword) {

  const validationResult = validatePasswordRules(newPassword);
  if (!validationResult.ok) throw new Error(validationResult.msg);

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');


  const ok = await comparePassword(currentPassword, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  for (let oldPasswords of user.passwordHistory || []) {
    const reused = await comparePassword(newPassword, oldPasswords.hash);
    if (reused) throw new Error('New password must not match recent passwords');
  }

  const newHash = await hashPassword(newPassword);

  user.passwordHistory.unshift({ hash: newHash, changedAt: new Date() });
  user.passwordHistory = user.passwordHistory.slice(0, PASSWORD_HISTORY_LIMIT);
  user.passwordHash = newHash;
  user.passwordChangedAt = new Date();
  user.isTempPassword = false;
  await user.save();

  await sendEmail(user.email, 'Password changed', 'Your password was changed successfully.');

  return true;
}

module.exports = changePassword;