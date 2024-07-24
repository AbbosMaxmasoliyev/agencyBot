const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./auth'),
]);

module.exports = stage;
