const config = require("./config");
const logger = require("./logger");

const startBot = async (bot, botConfig = {}) => {
  if (config.NODE_ENV === "production") {
    if (!config.DOMAIN) {
      throw new Error("DOMAIN is not defined in production environment");
    }
    botConfig.webhook = {
      domain: config.DOMAIN,
      port: "",
    };
  }

  const launchBot = async (retryCount = 0) => {
    try {
      await bot.launch(botConfig);
      logger.info(`Bot @${bot.botInfo.username} started!`);
    } catch (err) {
      if (err.response && err.response.error_code === 429) {
        const retryAfter = err.response.parameters.retry_after || 1;
        logger.warn(`Rate limited by Telegram. Retrying after ${retryAfter} seconds...`);
        setTimeout(() => launchBot(retryCount + 1), retryAfter * 1000);
      } else {
        logger.error(`Failed to launch bot: ${err.message}`);
      }
    }
  };

  await launchBot();
};

module.exports = startBot;
