const { Telegraf } = require("telegraf");
const config = require("../utils/config");
const logger = require("../../utils/logger");

const groupId = process.env.GROUP_ID
const bot = new Telegraf(process.env.BOT_TOKEN);
async function sendMessageToGroup(message) {
    try {
        await bot.telegram.sendMessage(groupId, message, { parse_mode: 'HTML' });
        console.log('Xabar yuborildi!');
    } catch (error) {
        logger.error('Xabar yuborishda xatolik:', error);
    }
}

async function sendMessageToUser(message, userId, markup) {
    try {
        await bot.telegram.sendMessage(userId, message, markup);
        console.log('Xabar yuborildi!');
    } catch (error) {
        logger.error('Xabar yuborishda xatolik:', error);
    }
}

module.exports = { bot, sendMessageToGroup, sendMessageToUser };
