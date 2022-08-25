import nodemailer from "nodemailer";

const { MAIL_HOST, MAIL_ACCOUNT, MAIL_PASSWORD } = process.env;

if (!MAIL_ACCOUNT || !MAIL_HOST || !MAIL_PASSWORD) {
  throw new Error("MAIL_ACCOUNT, MAIL_HOST or MAIL_PASSWORD not found");
}

const mailer = nodemailer.createTransport({
  host: MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: MAIL_ACCOUNT,
    pass: MAIL_PASSWORD,
  },
});

export default mailer;
