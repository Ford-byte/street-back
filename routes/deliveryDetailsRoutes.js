const e = require("express");
const deliveryDetailsController = require("../controller/deliveryDetailsController");

const router = e.Router();

router.get('/deliveryDetails/:id', deliveryDetailsController.getDetails);
router.post('/deliveryDetails', deliveryDetailsController.insertDetails);
router.put('/deliveryDetails/:id', deliveryDetailsController.updateDetails);
router.delete('/deliveryDetails/:id', deliveryDetailsController.deleteDetails);

module.exports = router;