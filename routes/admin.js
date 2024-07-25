const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { signUp, signIn, getData, updateData, deleteData, createManager } = require('../controller/adminControllers');
const { protect } = require('../middlewares/authMidlleware');
const { parser } = require('../middlewares/parser');

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

router.post('/sign-up', signUp);
router.post('/sign-in', parser, signIn);
router.post('/create-manager', protect, createManager);

module.exports = router;
