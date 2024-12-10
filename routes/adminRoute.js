const e = require("express");
const adminController = require("../controller/adminController");

const router = e.Router();

router.post('/admin', adminController.adminRegistration);
router.post('/admin/login',adminController.adminLogin);

module.exports = router;