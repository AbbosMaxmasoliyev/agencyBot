const { Scenes, Markup } = require("telegraf");
const User = require("../../models/user");
const bot = require("../core/bot");

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
    const selectedLanguage = ctx.callbackQuery.data;
    await ctx.answerCbQuery();
    console.log(selectedLanguage);
    // Foydalanuvchi tanlagan tilni saqlash
    const userId = ctx.from.id.toString();
    await User.findOneAndUpdate(
      { userId },
      { $set: { language: selectedLanguage } },
      { new: true }
    );

    // Tarjima tilini o‘zgartiring
    await ctx.i18n.changeLanguage(selectedLanguage);

    ctx.reply(ctx.i18n.t("language_changed")); // Til o'zgartirildi degan xabar
    return ctx.scene.enter("auth");
  }
);

module.exports = language;
