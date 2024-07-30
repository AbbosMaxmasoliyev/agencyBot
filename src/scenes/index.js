const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([require("./start"), require("./language"), require("./auth")]);

module.exports = stage;
