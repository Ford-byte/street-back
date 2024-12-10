const express = require('express');
const userInfroController = require('../controller/userInfoController');


const router = express.Router();

router.get('/userinfo/:uid',userInfroController.getData)

module.exports = router;