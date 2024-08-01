const {
  Scenes: { WizardScene },
  Markup,
} = require("telegraf");
const db = require("../database");
const User = require("../../models/user");
const bot = require("../core/bot");

function validateName(name) {
  const nameRegex = /^[A-Za-z\u0400-\u04FF]{2,}$/;
  return nameRegex.test(name);
}

function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+998\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

const scene = new WizardScene(
  "auth",
  async (ctx) => {
    ctx.reply(ctx.i18n.t("name"));
    return ctx.wizard.next();
  },
  async (ctx) => {
    const firstName = ctx.message?.text;

    if (!validateName(firstName)) {
      ctx.reply(ctx.i18n.t("error_name"));
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.firstName = firstName;
    ctx.reply(ctx.i18n.t("surname"));
    return ctx.wizard.next();
  },
  async (ctx) => {
    const lastName = ctx.message?.text;

    if (!validateName(lastName)) {
      ctx.reply(ctx.i18n.t("error_surname"));
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.lastName = lastName;
    ctx.reply(ctx.i18n.t("phoneNumber"));
    return ctx.wizard.next();
  },
  async (ctx) => {
    const phoneNumber = ctx.message?.text;

    if (!validatePhoneNumber(phoneNumber)) {
      ctx.reply(ctx.i18n.t("phoneNumber_error"));
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.phoneNumber = phoneNumber;
    const userId = ctx.from.id.toString();

    await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          firstName: ctx.wizard.state.firstName,
          lastName: ctx.wizard.state.lastName,
          phoneNumber: ctx.wizard.state.phoneNumber,
          language: ctx.wizard.state.language,
          fromTelegram: ctx.from,
          web_app: { userTelegramId: `${ctx.chat.username}-${Date.now()}-${ctx.chat.id}` }
        },
      },
      { new: true }
    );

    ctx.reply(ctx.i18n.t("saved_success"));
    return ctx.scene.enter("start");
  }
);

module.exports = scene;
