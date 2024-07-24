const {
    Scenes: { WizardScene },
  } = require("telegraf");
  // const db = require("../../database");
  
  const scene = new WizardScene(
    "auth",
    (ctx) => {
      ctx.reply("Ismingizni kiriting:");
      return ctx.wizard.next();
    },
    (ctx) => {
      const firstName = ctx.message?.text;
      if (!firstName) {
        ctx.reply("Iltimos, ismingizni kiriting:");
        return ctx.wizard.reenter();
      }
      ctx.wizard.state.firstName = firstName;
      ctx.reply("Familiyangizni kiriting:");
      return ctx.wizard.next();
    },
    (ctx) => {
      const lastName = ctx.message?.text;
      if (!lastName) {
        ctx.reply("Iltimos, familiyangizni kiriting:");
        return ctx.wizard.reenter();
      }
      ctx.wizard.state.lastName = lastName;
      ctx.reply("Telefon raqamingizni kiriting:");
      return ctx.wizard.next();
    },
    async (ctx) => {
      const phoneNumber = ctx.message?.text;
      if (!phoneNumber) {
        ctx.reply("Iltimos, telefon raqamingizni kiriting:");
        return ctx.wizard.reenter();
      }
      ctx.wizard.state.phoneNumber = phoneNumber;

      console.log(ctx.wizard.state.firstName, ctx.wizard.state.lastName, ctx.wizard.state.phoneNumber);
  
      const userId = ctx.from.id.toString();
      // let user = await db.controllers.users.getByUserId(userId);
  
      // if (!user) {
      //   user = await db.controllers.users.create({
      //     userId,
      //     firstName: ctx.wizard.state.firstName,
      //     lastName: ctx.wizard.state.lastName,
      //     phoneNumber: ctx.wizard.state.phoneNumber,
      //   });
      // } else {
      //   await db.controllers.users.updateUser(userId, {
      //     firstName: ctx.wizard.state.firstName,
      //     lastName: ctx.wizard.state.lastName,
      //     phoneNumber: ctx.wizard.state.phoneNumber,
      //   });
      // }
  
      ctx.reply("Ma'lumotlaringiz muvaffaqiyatli saqlandi. Rahmat!");
      return ctx.scene.enter("start");
    }
  );
  
  
  module.exports = scene;
  