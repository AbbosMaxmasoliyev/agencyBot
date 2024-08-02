const { Scenes, Markup } = require("telegraf");
const { User } = require("../database");
const { default: axios } = require("axios");

const scene = new Scenes.BaseScene("start");

let BOT_TOKEN = process.env.BOT_TOKEN;
let WEB_APP_URL = process.env.WEB_APP;

scene.enter(async (ctx) => {
  let userId = ctx.message.chat.id;
  let user = await User.findOne({ userId });
  console.log(userId);
  if (user.web_app.gender) {
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
    ])



    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: "1094968462",
      text: `@${ctx.chat.username}`,
    });

    await ctx.reply(ctx.i18n.t('welcome'), {
      reply_markup: {
        keyboard: [
          [
            { text: ctx.i18n.t('open_web_app'), web_app: { url: `${WEB_APP_URL}/user/${userId}`, } }
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
        resize_keyboard:true
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

    await ctx.reply(ctx.i18n.t("registration"), keyboard);
  }
});

module.exports = scene;
