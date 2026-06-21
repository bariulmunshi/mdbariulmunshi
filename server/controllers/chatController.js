import { GoogleGenerativeAI } from "@google/generative-ai";
import bariulProfile from "../data/bariulProfile.js";

const getClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        return null;
    }

    return new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );
};

// Rate limiter
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

const isRateLimited = (ip) => {
    const now = Date.now();

    const timestamps = (
        hits.get(ip) || []
    ).filter(
        (t) => now - t < RATE_WINDOW_MS
    );

    timestamps.push(now);

    hits.set(ip, timestamps);

    return timestamps.length > RATE_LIMIT;
};

const MAX_MESSAGE_LENGTH = 800;

export const chatWithAssistant = async (
    req,
    res
) => {
    try {
        const ip =
            req.headers[
                "x-forwarded-for"
            ]
                ?.split(",")[0]
                ?.trim() ||
            req.socket.remoteAddress ||
            "unknown";

        if (isRateLimited(ip)) {
            return res.status(429).json({
                success: false,
                message:
                    "Too many messages. Please try again later.",
            });
        }

        const { message } = req.body;

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message is required.",
            });
        }

        if (
            message.length >
            MAX_MESSAGE_LENGTH
        ) {
            return res.status(400).json({
                success: false,
                message: `Message must be under ${MAX_MESSAGE_LENGTH} characters.`,
            });
        }

        const client = getClient();

        if (!client) {
            return res.status(503).json({
                success: false,
                message:
                    "AI assistant is not configured yet.",
            });
        }

        const model =
            client.getGenerativeModel({
                model: "gemini-1.5-flash",
            });

        const prompt = `
${bariulProfile}

User Question:
${message}
`;

        const result =
            await model.generateContent(
                prompt
            );

        const response =
            result.response.text();

        return res.status(200).json({
            success: true,
            reply: response,
        });
    } catch (error) {
        console.error(
            "Gemini Chat Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong. Please try again.",
        });
    }
};