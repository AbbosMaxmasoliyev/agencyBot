const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { createUser, getUsers, orderUser, getUser, updateUser, deleteUser, updateUserWebInfo, updateUseStatus, updateUserBot, getUsersAdmin } = require('../controller/userController');
const { parser } = require('../middlewares/parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/create', createUser);
router.get('/all', getUsers);
router.get('/allAdmin', getUsersAdmin);
router.get('/order', orderUser);
router.get('/byId/:id', getUser);
router.put('/updateById/:id', updateUser);
router.put('/updateStatus/:id', updateUseStatus);
router.post('/web/:id', updateUserWebInfo);
router.post('/web_app/:id', updateUserBot);
router.delete('/:id', deleteUser);

module.exports = router;
