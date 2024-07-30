require("dotenv").config();

const bot = require("./core/bot");
const session = require("./core/session");
const stage = require("./scenes");
const User = require("../models/user");

const i18next = require('../i18');


bot.use(async (ctx, next) => {
  const language = ctx.from.language_code || 'uz'; // Foydalanuvchi tilini aniqlash
  ctx.i18n = i18next.cloneInstance();
  ctx.i18n.changeLanguage(language);
  await next();
});
bot.use(session);
bot.use(stage.middleware());

let main = bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({ userId });
    await user.save();
  }

  if (!user.firstName || !user.lastName || !user.phoneNumber) {
    ctx.scene.enter("auth");
  } else {
    ctx.scene.enter("start");
  }
});

module.exports = main
