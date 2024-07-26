const { Scenes, Markup } = require("telegraf");
const { User } = require("../database");
const { default: axios } = require("axios");

const scene = new Scenes.BaseScene("start");

let WEB_APP_URL = process.env.WEB_APP;
let BOT_TOKEN = process.env.BOT_TOKEN;

scene.enter(async (ctx) => {
  let userId = ctx.message.chat.id;
  let user = await User.findOne({ userId });
  console.log(userId);
  if (user.web_app.gender) {
    let keyboard = Markup.inlineKeyboard([
      [
        {
          text: "Здравствуйте, добро пожаловать",
          web_app: { url: `https://blogerwebapp.vercel.app/user/${userId}` },
        },
      ],
    ]).resize();
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: "1094968462",
      text: `@${ctx.chat.username}`,
    })
    await ctx.reply("Открыть веб-приложение", keyboard);
  } else {
    let keyboard = Markup.inlineKeyboard([
      [
        {
          text: "Регистрация",
          web_app: { url: `https://blogerwebapp.vercel.app/user/${userId}/bot` },
        },
      ],
    ]).resize();

    await ctx.reply("Зарегистрироваться", keyboard);
  }
});

module.exports = scene;
