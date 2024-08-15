const { Scenes, Markup } = require("telegraf");
const User = require("../../models/user");
const bot = require("../core/bot");
const logger = require("../../utils/logger");

const language = new Scenes.WizardScene(
  "language",
  // Tilni tanlash bosqichi
  (ctx) => {
    // Tilni tanlash uchun klaviatura
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('O\'zbekcha', 'uz')],
      [Markup.button.callback('Русский', 'ru')]
    ]);

    ctx.reply("Tilni tanlang:", keyboard);
    return ctx.wizard.next();
  },

  // Tanlangan tilni saqlash va o'zgartirish bosqichi
  async (ctx) => {
    const selectedLanguage = ctx?.callbackQuery?.data;
    const messageId = ctx?.message?.message_id;
    console.log(messageId);

    ctx.deleteMessage(messageId)


    logger.info(selectedLanguage);
    // Foydalanuvchi tanlagan tilni saqlashdi
    const userId = ctx.from.id;
    let user = await User.findOne(
      { userId, active: true, status: false },
    );
    await ctx?.answerCbQuery();
    user.language = selectedLanguage
    await user.save()
    logger.info(user);
    await ctx.i18n.changeLanguage(selectedLanguage);

    // Tarjima tilini o‘zgartiring

    // logger.info("ctx language=> " + ctx.i18n.language)


    return ctx.scene.enter("auth");
  }
);

module.exports = language;
