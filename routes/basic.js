const express = require("express")
const router = express.Router()


router.get('/index', (req, res) => {

    const indexFile = require("../public/index.html")
    res.sendFile("../public/index.html");
});



module.exports = router