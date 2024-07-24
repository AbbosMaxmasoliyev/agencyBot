const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([require("./start"), require("./auth")]);

module.exports = stage;
