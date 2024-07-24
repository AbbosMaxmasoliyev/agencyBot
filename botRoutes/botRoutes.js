// routes/botRoutes.js
const express = require('express');
const botController = require('../botcontroller/botcontroller');

const router = express.Router();

router.post('/webhook', (req, res) => {
    botController.handleUpdate(req.body, res);
});

module.exports = router;
