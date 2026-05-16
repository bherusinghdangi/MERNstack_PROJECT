const User = require('../models/User');
const { validatePasswordRules, hashPassword, sendEmail } = require("./utils")

async function signup(email, password, confirmPassword, userInfo) {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const validationResult = validatePasswordRules(password);
  if (!validationResult.ok) throw new Error(validationResult.msg);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('Email already in use');

  const hash = await hashPassword(password);
  const user = new User({
    email: email.toLowerCase(),
    fullName: userInfo.fullName || undefined,
    passwordHash: hash,
    state: userInfo.state,
    city: userInfo.city,
    passwordChangedAt: new Date(),
    passwordHistory: [{ hash, changedAt: new Date() }],
    isTempPassword: false,
    country: userInfo.country || undefined,
    phone: userInfo.phone || undefined,
    gender: userInfo.gender || undefined,
    dob: userInfo.dob || undefined,
  });
  await user.save();
  console.log(`User created in MongoDB: ${user.email}`);

  sendEmail(user.email, 'Welcome', 'Your account was created.')
    .catch(err => console.error('Email notification failed but user created:', err));

  return { id: user._id, email: user.email };
}

module.exports = signup;