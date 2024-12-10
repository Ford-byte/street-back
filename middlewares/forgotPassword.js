const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); 
const sendPassword = async (email, password) => {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',   
            auth: {
                user: process.env.USER_EMAIL, 
                pass: process.env.APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `STREETWEAR <${process.env.USER_EMAIL}>`,
            to: email,
            subject: 'Hello User, This is your OTP',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 4px;">
                        <p style="margin: 0 0 15px;">Dear ${email},</p>
                        <p style="margin: 0 0 15px;">We have received your request for a PIN code. Please find your PIN code below:</p>
                        <h2 style="margin: 0 0 15px; color: #333; font-size: 24px; font-weight: bold;">${password}</h2>
                        <p style="margin: 0 0 15px;">Use this PIN to complete your verification process. If you did not request this PIN, please contact our support team immediately.</p>
                        <p style="margin: 0;">Thank you!</p>
                        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
                            Best regards,<br>
                            STREETWEAR APPAREL<br>
                            -63083251723<br>
                        </p>
                    </div>
                </div>`,
        };

        const result = await transport.sendMail(mailOptions);
        console.log("Email sent successfully:", result);
        return result; 
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
module.exports = { sendEMail };
