require("dotenv").config();

const { bot } = require("./core/bot");
const session = require("./core/session");
const stage = require("./scenes");
const User = require("../models/user");

const i18next = require('../i18');
const logger = require("../utils/logger");


bot.use(async (ctx, next) => {
  let user = await User.findOne({ userId: ctx.from?.id })
  const language = user?.language || "uz"; // Foydalanuvchi tilini aniqlash
  ctx.i18n = i18next.cloneInstance();
  ctx.i18n.changeLanguage(language);
  await next();
});


bot.use(session);
bot.use(stage.middleware());

let main = bot.start(async (ctx) => {
  const userId = ctx.from.id;

  let user = await User.findOne({ userId, active: true });
  logger.info(user)
  if (!user) {
    user = new User({ userId, active: true, status: false });
    await user.save();
  }

  if (!user.firstName || !user.lastName || !user.phoneNumber) {
    ctx.scene.enter("language");
  } else {
    ctx.scene.enter("start");
  }
});







module.exports = main
