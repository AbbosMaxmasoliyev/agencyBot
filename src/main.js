require("dotenv").config();

const { bot } = require("./core/bot");
const session = require("./core/session");
const stage = require("./scenes");
const User = require("../models/user");
const i18next = require('../i18');
const logger = require("../utils/logger");

// Function to handle safe replies with error logging
async function safeReply(ctx, message, extra = {}) {
  try {
    await ctx.reply(message, extra);
  } catch (error) {
    logger.error(`Error sending message to user ${ctx.from?.id}: ${error.message}`);
  }
}

// Function to safely enter a scene, wrapping ctx.scene.enter
async function safeSceneEnter(ctx, sceneName) {
  try {
    await ctx.scene.enter(sceneName);
  } catch (error) {
    logger.error(`Error entering scene '${sceneName}' for user ${ctx.from?.id}: ${error.message}`);
  }
}

// Middleware to set up i18n and detect user language
bot.use(async (ctx, next) => {
  let user = await User.findOne({ userId: ctx.from?.id });
  const language = user?.language || "uz"; // Determine user language
  ctx.i18n = i18next.cloneInstance();
  ctx.i18n.changeLanguage(language);
  await next();
});

bot.use(session);
bot.use(stage.middleware());

let main = bot.start(async (ctx) => {
  const userId = ctx.from.id;

  // Find or create user
  let user;
  try {
    user = await User.findOne({ userId, active: true });
    if (!user) {
      user = new User({ userId, active: true, status: false });
      await user.save();
    }
    logger.info(user);
  } catch (error) {
    logger.error(`Error retrieving or saving user ${userId}: ${error.message}`);
    return;
  }

  // Enter the appropriate scene based on user's status
  if (!user.firstName || !user.lastName || !user.phoneNumber) {
    await safeSceneEnter(ctx, "language");
  } else {
    await safeSceneEnter(ctx, "start");
  }
});

module.exports = main;
