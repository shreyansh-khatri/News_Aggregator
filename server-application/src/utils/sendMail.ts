import nodemailer from "nodemailer";
import { ENV } from "../app";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "physics9358@gmail.com",
    pass: "trzwrbrxgcpxhdiu",
  },
  logger: true,
  debug: true,
});

const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  console.log("hewllo from sendEmail");
  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);
  await transporter.sendMail({
    from: `"NewsBot" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendMail;
