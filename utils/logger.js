const winston = require("winston");
const { Telegraf } = require("telegraf");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const bot = new Telegraf(process.env.LOG_BOT_TOKEN);
const logChatId = process.env.CHAT_ID;

const sendLogToTelegram = (level, message) => {
    bot.telegram
        .sendMessage(logChatId, `${level.toUpperCase()}: ${message}`)
        .catch((err) => console.error("Error sending log to Telegram:", err));
};

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            log: (info) => sendLogToTelegram("error", info.message),
        }),
        new winston.transports.File({
            filename: "logs/combined.log",
            level: "info",
            log: (info) => sendLogToTelegram("info", info.message),
        }),
        new winston.transports.File({ filename: "logs/all.log" }),
    ],
});

logger.on("data", (info) => {
    if (info.level === "error") {
        sendLogToTelegram("error", info.message);
    } else if (info.level === "info") {
        sendLogToTelegram("info", info.message);
    }
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                winston.format.colorize(),
                logFormat
            ),
        })
    );
}

bot.launch();

module.exports = logger;
