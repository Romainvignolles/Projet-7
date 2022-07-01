const express = require('express');
const router = express.Router();
const multer =  require('../middleware/multer')
const auth = require('../middleware/auth');




const commentCtrl = require('../controllers/commentaire');

// crée un nouveau commentaire
router.post('/commentaire', multer, commentCtrl.createComment);

// retourne tout les commentaires
router.get('/commentaire', commentCtrl.getAllComment);

//gestion du like
router.post('/commentaire/like' ,commentCtrl.likeComment)

// supprimer les commentaire join au publications
router.delete('/publication/commentaire/:id',multer,commentCtrl.deleteJoinComment);

// supprimer les commentaire
router.delete('/commentaire/:id',auth,multer,commentCtrl.deleteComment);



module.exports = router;