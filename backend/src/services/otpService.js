
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

    console.log("reached sendotpemail");

    const mailOptions = {
        from: "adithyanbinu666@gmail.com",
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
};

export { generateOTP, sendOTPEmail };


