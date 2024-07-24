const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { createBarter,
    updateBarterById,
    getBarterById,
    getAllBarters,
    deleteBarterById } = require('../controller/barter');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/create', createBarter);
router.get('/all', getAllBarters);
router.get('/getById/:id', getBarterById);
router.put('/update/:id', updateBarterById);
router.delete('/delete/:id', deleteBarterById);

module.exports = router;
