const {
  Scenes: { WizardScene },
} = require("telegraf");
const db = require("../database");
const User = require("../../models/user");

function validateName(name) {
  const nameRegex = /^[A-Za-z\u0400-\u04FF]{2,}$/;
  return nameRegex.test(name);
}

function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^998\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

const scene = new WizardScene(
  "auth",
  (ctx) => {
    ctx.reply("Ismingizni kiriting:");
    return ctx.wizard.next();
  },
  (ctx) => {
    const firstName = ctx.message?.text;

    if (!validateName(firstName)) {
      console.log(validateName(firstName));
      ctx.reply("Iltimos, ismingizni to'g'ri formatda katta harf bilan kiriting:");
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.firstName = firstName;
    ctx.reply("Familiyangizni kiriting:");
    return ctx.wizard.next();
  },
  (ctx) => {
    const lastName = ctx.message?.text;

    if (!validateName(lastName)) {
      ctx.reply("Iltimos, familiyangizni to'g'ri formatda katta harf bilan kiriting:");
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.lastName = lastName;
    ctx.reply("Telefon raqamingizni kiriting:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const phoneNumber = ctx.message?.text;

    if (!validatePhoneNumber(phoneNumber)) {
      ctx.reply("Iltimos, telefon raqamingizni kiriting:");
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
        },
      },
      { new: true }
    );

    ctx.reply("Ma'lumotlaringiz muvaffaqiyatli saqlandi. Rahmat!");
    return ctx.scene.enter("start");
  }
);

module.exports = scene;
