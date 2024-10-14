const { Scenes, Markup } = require("telegraf");
const User = require("../../models/user");
const bot = require("../core/bot");
const logger = require("../../utils/logger");
const { safeMessage } = require("../../utils/text");



const language = new Scenes.WizardScene(
  "language",
  // Tilni tanlash bosqichi
  (ctx) => {
    // Tilni tanlash uchun klaviatura
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("O'zbekcha", "uz")],
      [Markup.button.callback('Русский', "ru")],
    ]);

    safeMessage(ctx, "Tilni tanlang:", keyboard);
    return ctx.wizard.next();
  },

  // Tanlangan tilni saqlash va o'zgartirish bosqichi
  async (ctx) => {
    const selectedLanguage = ctx?.callbackQuery?.data;
    const messageId = ctx?.message?.message_id;

    try {
      if (messageId) {
        await ctx.deleteMessage(messageId); // Xabarni o'chirish
      }
    } catch (error) {
      logger.error(`Error deleting message for user ${ctx.chat.id}: ${error.message}`);
    }

    logger.info(selectedLanguage);

    // Foydalanuvchi tanlagan tilni saqlash
    const userId = ctx.from.id;
    let user = await User.findOne({ userId, active: true, status: false });

    if (user) {
      await ctx?.answerCbQuery();  // Callbackni tasdiqlash
      user.language = selectedLanguage;
      await user.save();
      await ctx.i18n.changeLanguage(selectedLanguage);

      logger.info(`User ${userId} selected language: ${selectedLanguage}`);
    } else {
      logger.error(`User not found with ID: ${userId}`);
    }

    return ctx.scene.enter("auth");
  }
);

module.exports = language;
