import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "physics9358@gmail.com",
    pass: "trzwrbrxgcpxhdiu",
  },
  // logger: true,
  // debug: true,
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

  await transporter.sendMail({
    from: `"NewsBot" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendMail;
