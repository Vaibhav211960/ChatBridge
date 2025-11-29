import nodemailer from 'nodemailer';
import dotnet from 'dotenv';
dotnet.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
})

const sendWelcomeEmail = async (to, name) => {
    await transporter.sendMail({
        from : proccess.env.EMAIL_USER,
        to,
        subject : 'Welcome to ChatBridge!',
        html : `<h1>Hello ${name},</h1>
                <p>Welcome to ChatBridge! We're excited to have you on board.</p>
                <p>Feel free to explore and connect with others.</p>
                </br>
                <p>Best Regards,<br/>The ChatBridge Team</p>`
    })
}
export default sendWelcomeEmail;