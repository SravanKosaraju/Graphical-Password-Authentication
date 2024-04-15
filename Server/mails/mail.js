import { createTransport } from "nodemailer"

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMTP_PASSWORD
    }
})


export { transporter }