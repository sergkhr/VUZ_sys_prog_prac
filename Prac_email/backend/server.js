import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*" //пока что разрешено только с локала кидать запросы
}));

// multer хранит файлы в памяти (для пересылки в nodemailer)
const upload = multer({
    storage: multer.memoryStorage()
});

// теперь НЕ используем express.json()
// потому что будет multipart/form-data

function getTransportConfig(provider) {

    if (provider === "gmail") {
        return {
            host: process.env.GMAIL_SMTP_HOST,
            port: Number(process.env.GMAIL_SMTP_PORT),
            secure: process.env.GMAIL_SMTP_SECURE === "true",
            auth: {
                user: process.env.GMAIL_SMTP_USER,
                pass: process.env.GMAIL_SMTP_PASS
            }
        };
    }

    if (provider === "yandex") {
        return {
            host: process.env.YANDEX_SMTP_HOST,
            port: Number(process.env.YANDEX_SMTP_PORT),
            secure: process.env.YANDEX_SMTP_SECURE === "true",
            auth: {
                user: process.env.YANDEX_SMTP_USER,
                pass: process.env.YANDEX_SMTP_PASS
            }
        };
    }

    throw new Error("Unsupported provider");
}

function normalizeRecipients(to) {

    if (Array.isArray(to)) return to;

    if (typeof to === "string") {
        return to.split(",").map(email => email.trim());
    }

    throw new Error("Invalid recipients format");
}

// POST /send
app.post("/send", upload.array("attachments"), async (req, res) => {

    try {

        const { provider, to, subject, text } = req.body;

        if (!provider) throw new Error("Provider is required");
        if (!to) throw new Error("Recipients are required");

        const transportConfig = getTransportConfig(provider);
        const transporter = nodemailer.createTransport(transportConfig);

        const recipients = normalizeRecipients(to);

        // подготовка вложений
        const attachments = (req.files || []).map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));

        const successful = [];
        const failed = [];

        for (const recipient of recipients) {
            try {

                await transporter.sendMail({
                    from: transportConfig.auth.user,
                    to: recipient,
                    subject,
                    text,
                    attachments
                });

                successful.push(recipient);

            } catch (err) {

                failed.push({
                    recipient,
                    error: err.message
                });
            }
        }

        res.json({
            status: "completed",
            sent: successful.length,
            failed: failed.length,
            successfulRecipients: successful,
            failedRecipients: failed
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});