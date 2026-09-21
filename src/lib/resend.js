import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Saasu Maa's Food <otp@saasumaasfood.site>";

/**
 * Sends a branded, royal-themed HTML OTP email using Resend.
 * Falls back gracefully to console logging in development if RESEND_API_KEY is not configured.
 */
export async function sendOtpEmail({ email, otp, purpose = 'login' }) {
  const isSignup = purpose === 'signup';
  const actionTitle = isSignup ? 'Welcome to Saasu Maa!' : 'Your Verification Code';
  const actionSubtitle = isSignup
    ? 'Verify your email to complete your registration'
    : 'Use the one-time code below to log in securely';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actionTitle}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FBF8F3; margin: 0; padding: 20px; color: #2D2424; }
    .container { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8DFD8; box-shadow: 0 4px 20px rgba(74, 14, 23, 0.08); }
    .header { background: linear-gradient(135deg, #4A0E17 0%, #2E080E 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
    .header-logo { font-size: 28px; font-weight: 800; color: #E8C15A; letter-spacing: 0.5px; margin: 0; }
    .header-sub { font-size: 13px; color: #F5E6CC; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 36px 28px; text-align: center; }
    .title { font-size: 22px; font-weight: 700; color: #4A0E17; margin: 0 0 10px 0; }
    .subtitle { font-size: 14px; color: #665C54; line-height: 1.5; margin: 0 0 28px 0; }
    .otp-box { background: #FDF9F0; border: 2px dashed #D4AF37; border-radius: 12px; padding: 20px; margin: 0 auto 24px auto; display: inline-block; min-width: 240px; }
    .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #4A0E17; font-family: 'Courier New', Courier, monospace; margin: 0; }
    .expiry-badge { display: inline-block; background: #FFF3CD; color: #856404; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-top: 10px; }
    .security-note { font-size: 12px; color: #887B75; line-height: 1.6; border-top: 1px solid #F0E8E2; padding-top: 20px; margin-top: 24px; text-align: left; }
    .footer { background: #F7F3EE; padding: 20px 24px; text-align: center; font-size: 12px; color: #8C8078; border-top: 1px solid #EAE3DC; }
    .footer a { color: #8A1526; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">सासू माँ का अचार</div>
      <div class="header-sub">Saasu Maa's Food • The Taste of Tradition</div>
    </div>
    <div class="content">
      <h1 class="title">${actionTitle}</h1>
      <p class="subtitle">${actionSubtitle}</p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="expiry-badge">⏱ Valid for 10 minutes</div>
      </div>

      <p style="font-size: 14px; color: #554B46; margin: 0 0 16px 0;">
        Enter this 6-digit code on the verification screen to proceed.
      </p>

      <div class="security-note">
        <strong>🔒 Security Notice:</strong> Never share this OTP with anyone. Saasu Maa's Food staff will never ask for your one-time password. If you did not make this request, you can safely disregard this email.
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">📍 Traditional Homemade Kitchen • Bareilly, Uttar Pradesh, India</p>
      <p style="margin: 0;">Need help? WhatsApp/Call <a href="tel:8979319003">+91 8979319003</a> or email <a href="mailto:query@saasumaasfood.site">query@saasumaasfood.site</a></p>
    </div>
  </div>
</body>
</html>
  `;

  // Development Fallback or Missing API Key
  if (!resend) {
    console.log('\n=============================================================');
    console.log(`[DEV AUTH OTP] Resend API key not configured.`);
    console.log(`[DEV AUTH OTP] Email: ${email}`);
    console.log(`[DEV AUTH OTP] Code:  ${otp} (Purpose: ${purpose})`);
    console.log('=============================================================\n');
    return {
      success: true,
      devMode: true,
      messageId: `mock-dev-${Date.now()}`,
    };
  }

  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: `${otp} is your Saasu Maa Ka Achaar verification code`,
      html: htmlContent,
      text: `Your Saasu Maa Ka Achaar verification code is: ${otp}. It is valid for 10 minutes. Please do not share it with anyone.`,
    });

    if (data.error) {
      console.warn('[Resend Warning]', data.error);
      // If Resend failed (e.g. unverified test domain), log in dev so user isn't stuck
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV FALLBACK OTP] ${email} -> ${otp}`);
        return { success: true, devFallback: true, error: data.error };
      }
      return { success: false, error: data.error.message || 'Failed to deliver email' };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[Resend Error]', err);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV FALLBACK OTP] ${email} -> ${otp}`);
      return { success: true, devFallback: true, error: err.message };
    }
    return { success: false, error: err.message || 'Error delivering verification email' };
  }
}
