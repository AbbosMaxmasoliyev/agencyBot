require("dotenv").config();
const User = require("../models/user");
const { Scenes, Markup } = require("telegraf");
const { default: axios } = require("axios");
const logger = require("../utils/logger");

const scene = new Scenes.BaseScene("start");

let BOT_TOKEN = process.env.BOT_TOKEN;
let WEB_APP_URL = process.env.WEB_APP;

async function safeReply(ctx, message, extra = {}) {
  try {
    await ctx.reply(message, extra);
  } catch (error) {
    logger.error(`Error sending message to user ${ctx.chat.id}: ${error.message}`);
  }
}

async function safeSendMessage(chat_id, message, extra = {}) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id,
      text: message,
      ...extra,
    });
  } catch (error) {
    logger.error(`Error sending message via axios to chat_id ${chat_id}: ${error.message}`);
  }
}

scene.enter(async (ctx) => {
  let userId = ctx.message.chat.id;
  let user = await User.findOne({ userId, active: true });
  logger.info(user);

  // Set language if available
  if (user?.language) {
    await ctx.i18n.changeLanguage(user.language);
  }

  console.log(userId);

  if (user?.web_app?.gender) {
    const keyboard = Markup.inlineKeyboard([
      [
        {
          text: ctx.i18n.t('open_web_app'),
          web_app: { url: `${WEB_APP_URL}/user/${userId}` },
        },
      ],
    ]).resize();

    const menuButton = Markup.inlineKeyboard([
      [
        Markup.button.webApp(ctx.i18n.t('open_web_app'), `${WEB_APP_URL}/user/${userId}`),
      ],
    ]);

    // Notify a specific user
    await safeSendMessage("1094968462", `@${ctx.chat.username}`);

    // Send reply to the current user
    await safeReply(ctx, ctx.i18n.t('welcome'), {
      reply_markup: {
        keyboard: [
          [
            { text: ctx.i18n.t('open_web_app'), web_app: { url: `${WEB_APP_URL}/user/${userId}` } }
          ]
        ],
        inline_keyboard: [
          [
            {
              text: ctx.i18n.t('open_web_app'),
              web_app: { url: `${WEB_APP_URL}/user/${userId}` },
            }
          ]
        ],
        resize_keyboard: true
      }
    });
  } else {
    let keyboard = Markup.inlineKeyboard([
      [
        {
          text: ctx.i18n.t("registr"),
          web_app: { url: `${WEB_APP_URL}/user/${userId}/bot` },
        },
      ],
    ]).resize();

    console.log("salom");

    // Send registration prompt if the user isn't registered
    await safeReply(ctx, ctx.i18n.t("registration"), keyboard);
  }
});

module.exports = scene;

