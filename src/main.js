require("dotenv").config();

const bot = require("./core/bot");
const session = require("./core/session");
const stage = require("./scenes");
const User = require("../models/user");

bot.use(session);
bot.use(stage.middleware());

bot.start(async (ctx) => {
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

module.exports = bot
