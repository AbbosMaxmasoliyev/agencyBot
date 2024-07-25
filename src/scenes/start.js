const { Scenes, Markup } = require("telegraf");
const { User } = require("../database");

const scene = new Scenes.BaseScene("start");

let WEB_APP_URL = process.env.WEB_APP

scene.enter(async (ctx) => {
  let userId = ctx.message.chat.id
  let user = await User.findOne({ userId })
  console.log(userId);
  if (user.web_app.gender) {
    let keyboard = Markup.inlineKeyboard([
      [
        {
          text: "Salom xush kelibsiz",
          web_app: { url: `https://blogerwebapp.vercel.app/users/${userId}` },
        },
      ],
    ]).resize();

    await ctx.reply("Web app ochish", keyboard);
  } else {
    let keyboard = Markup.inlineKeyboard([
      [
        {
          text: "Registratsiya",
          web_app: { url: `https://blogerwebapp.vercel.app/user/${userId}/bot` },
        },
      ],
    ]).resize();

    await ctx.reply("Ro'yxatdan o'tish", keyboard);
  }
});

module.exports = scene;
