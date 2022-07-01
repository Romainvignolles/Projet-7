const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer =  require('../middleware/multer')


const postCtrl = require('../controllers/publication');

// crée une nouvelle publication
router.post('/publication', auth, multer, postCtrl.createThing);

// retourne tout les publications
router.get('/publication', postCtrl.getAllStuff);

// modification d'une publication existant
router.put('/publication/:id', auth,multer,postCtrl.modifyThing);

// supprimer une publication
router.delete('/publication/:id',auth,multer,postCtrl.deleteThing);

//gestion du like
router.post('/publication/like' ,postCtrl.likeThing)




module.exports = router;