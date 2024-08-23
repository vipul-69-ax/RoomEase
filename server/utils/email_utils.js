const { createTransport } = require("nodemailer");
require("dotenv").config();

const transporter = createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "sharmavipul01002@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  secure: true,
});

function send_password_recovery_email(email_receiver, token, callback) {
  console.log(process.env.GOOGLE_APP_PASSWORD);
  const verificationLink = `http://172.20.10.5:3000/auth/recover-password?token=${token}`;
  const mailData = {
    from: "sharmavipul01002@gmail.com",
    to: email_receiver,
    subject: "Password Recovery RoomEase.",
    html: `
        Hi ${email_receiver},
        To reset your password for <strong>RoomEase</strong>, click on the button below.
        <a href=${verificationLink}>Reset my password</a>
        <br/>
            RoomEase 2024.
        <br/>
      `,
  };
  transporter.sendMail(mailData, callback);
}

module.exports = { send_password_recovery_email };
