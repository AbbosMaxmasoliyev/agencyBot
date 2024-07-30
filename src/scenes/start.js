const { Scenes, Markup } = require("telegraf");
const { User } = require("../database");
const { default: axios } = require("axios");

const scene = new Scenes.BaseScene("start");

let BOT_TOKEN = process.env.BOT_TOKEN;
let WEB_APP_URL = process.env.WEB_APP;
// let WEB_APP_URL = "https://d419-2605-6440-4015-8000-9e86-7d6c-9b1a-76a5.ngrok-free.app";

scene.enter(async (ctx) => {
  let userId = ctx.message.chat.id;
  console.log(ctx.i18n);
  let user = await User.findOne({ userId });
  console.log(userId);
  if (user.web_app.gender) {
    let keyboard = Markup.inlineKeyboard([
      [
        {
          text: ctx.i18n.t('open_web_app'),
          // web_app: { url: `${WEB_APP_URL}/user/${userId}` },
          web_app: { url: `${WEB_APP_URL}/user/${userId}` },
        },
      ],
    ]).resize();
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: "1094968462",
      text: `@${ctx.chat.username}`,
    })
    await ctx.reply(ctx.i18n.t('welcome'), keyboard);
  } else {
    let keyboard = Markup.inlineKeyboard([
      [
        {
          text: ctx.i18("registr"),
          web_app: { url: `${WEB_APP_URL}/user/${userId}/bot` },
        },
      ],
    ]).resize();

    await ctx.reply("Зарегистрироваться", keyboard);
  }
});

module.exports = scene;
