const express = require('express');
const router = express.Router();
const validateSignup = require('../middleware/validateSignup');
const multer =  require('../middleware/multer')




const userCtrl = require('../controllers/user.js');

router.post('/signup', validateSignup, userCtrl.signup);
router.post('/login',userCtrl.login);

// modification de l'user
router.put('/user/:id',multer,validateSignup,userCtrl.modifyUser);

// supprimer un user
router.delete('/user/delete/:id',userCtrl.deleteUser);



module.exports = router;