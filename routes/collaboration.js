const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { createCollaboration,
    updateCollaborationById,
    getCollaborationById,
    getAllCollaborations,
    deleteCollaborationById } = require('../controller/collaboration');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/create', createCollaboration);
router.get('/all', getAllCollaborations);
router.get('/getById/:id', getCollaborationById);
router.put('/update/:id', updateCollaborationById);
router.delete('/delete/:id', deleteCollaborationById);

module.exports = router;
