const transporter = require("./nodemail.js");
module.exports.sendVerificationEmail = async (email, verificationLink) => {
  try {
    // 3. Define the email options
    const mailOptions = {
      from: ` <${process.env.EMAIL_USER}>`, // Sender
      to: email, // Recipient
      subject: "Please verify your email address",

      // We send HTML that includes the clickable link
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for signing up! Please click the link below to verify your email address:</p>
        <a href="${verificationLink}" style="padding: 10px 15px; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <br>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    // You could throw the error to be caught by your route handler
    throw new Error("Could not send verification email.");
  }
};
