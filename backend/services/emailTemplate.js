const getResetPasswordEmailTemplate = (email,resetUrl,resetToken) => {

    const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset</h1>
            </div>
            <div style="padding: 30px; color: #333333; line-height: 1.6;">
            <p>Hello ${email},</p>
            <p>We received a request to reset your password. Use the 6-digit verification code below to complete the process:</p>
            
            <!-- Code Display -->
            <div style="background-color: #f3f4f6; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0; border: 1px dashed #4f46e5;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold; color: #1f2937; letter-spacing: 5px;">
                ${resetToken}
                </span>
            </div>

            <p>Click the button below to go to the reset page:</p>
            
            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
                </a>
            </div>

            <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
                This token will expire in <strong>60 minutes</strong>. If you did not request this, please ignore this email or contact support.
            </p>
            </div>
            <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e0e0e0;">
            © ${new Date().getFullYear()} Your App Name. All rights reserved.
            </div>
        </div>
        `;
    return htmlContent;
}

const getVerificationCompletedEmailTemplate = (fullName, email) => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #bef264; padding: 30px; text-align: center;">
                <h1 style="color: #000000; margin: 0; font-size: 28px; font-weight: 800;">Verification Successful</h1>
            </div>
            <div style="padding: 40px; color: #1f2937; line-height: 1.8;">
                <p style="font-size: 18px;">Hello <strong>${fullName || email}</strong>,</p>
                <p>This is to confirm that your <strong>Two-Factor Authentication (2FA)</strong> has been successfully verified for your Nexus Invest account.</p>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin: 30px 0; border: 1px solid #e5e7eb;">
                    <h3 style="margin-top: 0; color: #111827; border-bottom: 2px solid #bef264; display: inline-block; padding-bottom: 5px;">Session Details</h3>
                    <ul style="list-style: none; padding: 0; margin: 15px 0 0 0;">
                        <li style="margin-bottom: 10px;"><strong>• Status:</strong> <span style="color: #059669; font-weight: 600;">Verified</span></li>
                        <li style="margin-bottom: 10px;"><strong>• User:</strong> ${fullName || 'Investor'}</li>
                        <li style="margin-bottom: 10px;"><strong>• Email:</strong> ${email}</li>
                        <li style="margin-bottom: 10px;"><strong>• Time:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                </div>

                <p>You now have full access to your dashboard, portfolio, and secure trading features. Your security is our top priority, and this extra layer of protection ensures your assets remain safe.</p>
                
                <p style="margin-top: 30px;">If this wasn't you, please secure your account immediately by changing your password or contacting our support team.</p>
            </div>
            <div style="background-color: #111827; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
                © ${new Date().getFullYear()} Nexus Invest. The future of smart investing.<br/>
                This is an automated security notification.
            </div>
        </div>
    `;
};

module.exports = {getResetPasswordEmailTemplate, getVerificationCompletedEmailTemplate}