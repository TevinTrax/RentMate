import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error.message);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  const message = {
    from: `"RentMate" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your RentMate OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #2f855a;">RentMate OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px; color: #1a202c;">${otp}</h1>
        <p>This code will expire soon. Do not share it with anyone.</p>
      </div>
    `,
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
    text: `Reset your password using this link: ${resetLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 12px; background: linear-gradient(to bottom, #e6f4ea, #f0fff4); text-align: center; border: 1px solid #c6e6cd;">
        <h2 style="color: #2f855a;">RentMate Password Reset</h2>
        <p style="color: #276749; font-size: 16px;">We received a request to reset your password.</p>
        
        <a href="${resetLink}" 
           style="display: inline-block; padding: 12px 25px; margin: 20px 0; background-color: #38a169; color: white; font-weight: bold; border-radius: 8px; text-decoration: none;">
           Reset Password
        </a>

        <p style="color: #276749; font-size: 14px;">If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break: break-word; color: #1a202c; font-size: 14px;">${resetLink}</p>

        <p style="color: #276749; font-size: 14px;">If you didn't request a password reset, please ignore this email.</p>
        <p style="color: #276749; font-size: 14px; margin-top: 30px;">— The RentMate Team</p>
      </div>
    `,
  };

  await transporter.sendMail(message);
};