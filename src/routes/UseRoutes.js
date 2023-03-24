const express = require("express");
const router = express.Router();

//controllers
const {Register, Login, getCurrentUser, Update, getByUserId} = require("../controllers/UserController");


//middlewares
const validate = require("../middlewares/handleValidation");
const {userCreateValitaion, loginValidation, userUpdateValidation} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

//Rotas
router.post('/register',userCreateValitaion(),validate, Register);
router.post('/login',loginValidation(), validate, Login);
router.get('/profile', authGuard, getCurrentUser);
router.put('/', authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), Update);
router.get('/:id', getByUserId);


module.exports = router;