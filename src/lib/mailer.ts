import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your App Password
  },
});
