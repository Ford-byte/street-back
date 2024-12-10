const express = require('express');
const userController = require('../controller/userController');
const { upload } = require('../middlewares/multer');
    

const router = express.Router();

router.get('/users', userController.getUsers); //Goods nani
router.post('/user/registration', userController.userRegistration); //Goods nani
router.post('/user/login', userController.userLogin); // Goods nani
router.post('/user/otp', userController.otp); // Goods nani
router.post('/user/forgotpassword', userController.forgotPassword); // Goods nani
router.post('/user/changepassword', userController.changePassword); // Goods nani
router.post('/user/addRole', userController.addRole);
router.post('/users/:role', userController.getUserByRole)
router.post('/user/profile', upload.single('image'), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: 'File upload failed', details: req.fileValidationError });
    }
    next();
}, userController.addProfile);
router.post('/user/profile/:uid', userController.getProfile)
router.put('/user/:id', userController.updateUser);
router.post('/user/:id', userController.getUserById);
router.delete('/user/:id', userController.deleteUser);
router.delete('/userBlock/:id', userController.blockUser);

module.exports = router;














// const { validateUserLogin } = require('../middlewares/userValidation');
// const { verifyUser } = require('../middlewares/tokenAuthentication');
// const verifyToken = require('../services/verifyToken');
// router.get('/validateToken', verifyUser, verifyToken)
