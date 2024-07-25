const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { signUp, signIn, getManagers, deleteManager, createManager, updateManager } = require('../controller/adminControllers');
const { protect } = require('../middlewares/authMidlleware');
const { parser } = require('../middlewares/parser');

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

router.post('/sign-up', signUp);
router.post('/sign-in', parser, signIn);
router.post('/create-manager', protect, createManager);
router.get('/all-manager', protect, getManagers);
router.put('/update-manager/:id', protect, updateManager);
router.delete('/delete/:id', protect, deleteManager);

module.exports = router;
