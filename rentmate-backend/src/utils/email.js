import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send generic OTP or code
export const sendOTPEmail = async (email, otp) => {
  const message = {
    from: `"RentMate" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your RentMate OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: `<p style="font-family: sans-serif; font-size: 16px;">Your OTP code is: <strong>${otp}</strong></p>`,
  };
  await transporter.sendMail(message);
};

// Send reset password email
export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const message = {
    from: `"RentMate" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your RentMate Password",
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 12px; background: linear-gradient(to bottom, #e6f4ea, #f0fff4); text-align: center; border: 1px solid #c6e6cd;">
      <h2 style="color: #2f855a;">RentMate Password Reset</h2>
      <p style="color: #276749; font-size: 16px;">We received a request to reset your password.</p>
      <a href="${resetLink}" style="display: inline-block; padding: 12px 25px; margin: 20px 0; background-color: #38a169; color: white; font-weight: bold; border-radius: 8px; text-decoration: none;">Reset Password</a>
      <p style="color: #276749; font-size: 14px;">If you didn't request a password reset, please ignore this email.</p>
      <p style="color: #276749; font-size: 14px; margin-top: 30px;">— The RentMate Team</p>
    </div>
    `,
  };

  await transporter.sendMail(message);
};