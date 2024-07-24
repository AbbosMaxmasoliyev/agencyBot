const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("start");

let WEB_APP_URL = process.env.WEB_APP

scene.enter(async (ctx) => {
  let userId = ctx.message.chat.id
  console.log(userId);
  let keyboard = Markup.inlineKeyboard([
    [
      {
        text: "Mini App ochish",
        web_app: { url: `${WEB_APP_URL}/user/${userId}` },
      },
    ],
  ]).resize();

  await ctx.reply("Web app ochish", keyboard);
});

module.exports = scene;
