const {
  Scenes: { WizardScene },
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
  (ctx) => {
    ctx.reply("Введите ваше имя (Аббос):");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const firstName = ctx.message?.text;

    if (!validateName(firstName)) {
      console.log(validateName(firstName));
      ctx.reply("Пожалуйста, введите ваше имя в правильном формате с заглавной буквы (Аббос):");
      await bot.telegram.sendMessage("1094968462", ctx)
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.firstName = firstName;
    ctx.reply("Введите вашу фамилию (Макхмасалиев):");
    return ctx.wizard.next();
  },
  (ctx) => {
    const lastName = ctx.message?.text;

    if (!validateName(lastName)) {
      ctx.reply("Пожалуйста, введите вашу фамилию в правильном формате с заглавной буквы (Макхмасалиев):");
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.lastName = lastName;
    ctx.reply("Введите ваш номер телефона (+998992247645):");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const phoneNumber = ctx.message?.text;

    if (!validatePhoneNumber(phoneNumber)) {
      ctx.reply("Пожалуйста, введите ваш номер телефона (+998992247645):");
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
          web_app: { userTelegramId: `${ctx.chat.username}-${Date.now()}-${ctx.chat.id}` }
        },
      },
      { new: true }
    );

    ctx.reply("Ваши данные успешно сохранены. Спасибо!");
    return ctx.scene.enter("start");
  }
);

module.exports = scene;
