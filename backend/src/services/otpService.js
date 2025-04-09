
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        ciphers: 'SSLv3'
    }

});


transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to SMTP server:", error);
    } else {
        console.log("SMTP server is ready to take messages");
    }
});


const sendOTPEmail = async (email, otp) => {
    console.log("Sending verification email");

    const mailOptions = {
        from: '"Adiyo Security" <noreply@adiyo.com>', // Use a professional from address
        to: email,
        subject: "Your Adiyo Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333;">Your Verification Code</h2>
                </div>
                <p style="margin-bottom: 15px;">Hello,</p>
                <p style="margin-bottom: 15px;">Please use the verification code below to complete your action:</p>
                <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; border-radius: 4px;">
                    <h2 style="margin: 0; font-size: 24px; letter-spacing: 5px;">${otp}</h2>
                </div>
                <p style="margin-bottom: 15px;">This code will expire in 10 minutes.</p>
                <p style="margin-bottom: 15px;">If you didn't request this code, you can safely ignore this email.</p>
                <p style="margin-bottom: 15px;">Thank you,<br>The Adiyo Team</p>
                <div style="font-size: 12px; color: #777; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    This is an automated message, please do not reply to this email.
                </div>
            </div>
        `,
    };
    await transporter.sendMail(mailOptions);
};

export { generateOTP, sendOTPEmail };


