const {
  Scenes: { WizardScene },
  Markup,
} = require("telegraf");
const User = require("../../models/user");
const logger = require("../../utils/logger");

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
    let userId = ctx.chat.id
    let user = await User.findOne({ userId, active: true, status: false })
    console.log("====24");
    console.log(user);
    console.log("====24");


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
    logger.info("ctx language=> " + ctx.i18n.language)
    return ctx.wizard.next();
  },
  async (ctx) => {
    const lastName = ctx.message?.text;

    if (!validateName(lastName)) {
      ctx.reply(ctx.i18n.t("error_surname"));
      return ctx.wizard.selectStep(ctx.wizard.cursor);
    }

    ctx.wizard.state.lastName = lastName;
    ctx.reply(ctx.i18n.t("phoneNumber"), {
      reply_markup: {
        keyboard: [
          [
            {
              text: ctx.i18n.t("Share Phone Number"), // Masalan: "Telefon raqamimni ulashish"
              request_contact: true // Telefon raqamni so'rash
            }
          ]
        ],
        resize_keyboard: true, // Klaviatura o'lchamini avtomatik moslashtirish
        one_time_keyboard: false // Klaviaturani faqat bir marta ko'rsatish
      }
    });

    return ctx.wizard.next();
  },
  async (ctx) => {

    const phoneNumber = ctx.message?.contact?.phone_number;

    console.log(phoneNumber);

    if (phoneNumber) {
      ctx.wizard.state.phoneNumber = phoneNumber;
      const userId = ctx.from.id.toString();

      await User.findOneAndUpdate(
        { userId, active: true },
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

      ctx.reply(ctx.i18n.t("saved_success"), {
        reply_markup: {
          remove_keyboard: true
        }
      });
      return ctx.scene.enter("start");
    } else {
      ctx.reply(ctx.i18n.t("phoneNumber_error"));

      ctx.wizard.selectStep(ctx.wizard.cursor);
    }
  }

);

module.exports = scene;
