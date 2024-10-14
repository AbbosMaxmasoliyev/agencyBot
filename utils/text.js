const logger = require("./logger");

let textGetWithLanguage = (user, key) => {
    let language = user?.language ? user.language : "ru"
    let pathMessage = require(`../public/locales/${language}/translation.json`)
    return pathMessage[key]
}
async function safeMessage(ctx, message, extra = {}) {
    try {
      await ctx.reply(message, extra);
    } catch (error) {
      logger.error(`Error sending message to user ${ctx.chat.id}: ${error.message}`);
    }
  }

module.exports = { textGetWithLanguage, safeMessage }