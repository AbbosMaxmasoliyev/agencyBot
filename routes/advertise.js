const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { createAdvertise, getAllAdvertises, deleteAdvertiseById, getAdvertiseById, updateAdvertiseById } = require('../controller/advertise');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/create', createAdvertise);
router.get('/all', getAllAdvertises);
router.get('/getById/:id', getAdvertiseById);
router.put('/update/:id', updateAdvertiseById);
router.delete('/delete/:id', deleteAdvertiseById);

module.exports = router;
