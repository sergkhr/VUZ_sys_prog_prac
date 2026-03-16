import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// POST /send
app.post("/send", async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        let m_host = process.env.SMTP_HOST;
        let m_user = process.env.SMTP_USER;
        let m_pass = process.env.SMTP_PASS

        const transporter = nodemailer.createTransport({
            host: m_host,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: m_user,
                pass: m_pass
            }
        });

        await transporter.sendMail({
            from: m_user,
            to,
            subject,
            text
        });

        res.json({ status: "ok" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});