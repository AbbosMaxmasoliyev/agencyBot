const { Telegraf } = require("telegraf");
const config = require("../utils/config");

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = bot;
