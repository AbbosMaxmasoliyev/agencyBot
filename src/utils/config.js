const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  BOT_TOKEN: process.env.BOT_TOKEN,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  SESSION_TYPE: process.env.SESSION_TYPE,
  DOMAIN: "https://agencybot.onrender.com",
  PORT: process.env.DOMAIN_PORT,
  MONGO_URL: process.env.MONGO_URL,
  URL: process.env.URL,
};

module.exports = config;
