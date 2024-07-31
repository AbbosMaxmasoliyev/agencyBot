const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { createAnnounce,
    updateAnnounceById,
    getAnnounceById,
    getAllAnnounces,
    deleteAnnounceById } = require('../controller/announce');
const { getMyCollaborations } = require('../controller/collaboration');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/create', createAnnounce);
router.get('/all', getAllAnnounces);
router.get('/my-collaboration/:userId/:promotion', getMyCollaborations);
router.get('/getById/:id', getAnnounceById);
router.put('/update/:id', updateAnnounceById);
router.delete('/delete/:id', deleteAnnounceById);

module.exports = router;
