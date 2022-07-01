const Comment = require('../models/').comment;
const User = require('../models/').user;
const Post = require('../models/').post;
const fs = require('fs');





exports.createComment = (req, res, next) => {
    let image = null
    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }


    let comment = new Comment({
        commentContent: req.body.commentContent,
        image: image,
        utilisateurId: req.body.utilisateurId,
        publicationId: req.body.publicationId,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,

    });
    if (req.body.textContent !== ("")) {

        comment.save()
            .then(() => res.status(201).json({ message: 'commentaire ajoutée a la base de donnée!' }))
            .catch(error => res.status(400).json({ error: error }))
    } else {
        res.status(500).json({ message: 'Champs invalide' })
    }
};

exports.getAllComment = (req, res, next) => {
    Comment.findAll({ include: Post, include: User })
        .then((things) => res.status(200).send(things))
        .catch((error) => res.status(400).send({ error: error }))
};

exports.likeComment = (req, res, next) => {
    let logUser = req.body.userId;
    const frontLike = req.body.like;
    let actualLike = 0;
    let actualDislike = 0;
    ;
    Comment.findOne({ where: { id: req.body.id } })               // je recherche la sauce concerné par le like/dislike
        .then((comment) => {
            actualLike = comment.likes;
            actualDislike = comment.dislikes;
            const like = actualLike + 1;
            const dislike = actualDislike - 1;
            const unLike = actualLike - 1;
            const unDislike = actualDislike + 1
            let userLikeArray = comment.usersLiked;
            let userDislikeArray = comment.usersDisliked;

            if (frontLike === 1) {

                console.log("j'aime")

                if (userDislikeArray.includes(logUser)) {  //si le logUser a deja dislike ca bloque
                    return res.status(401).json({ message: 'vous avez deja dislike cette publication !' })
                }
                if (userLikeArray.includes(logUser)) {   //si je logUser a deja like ca unLike

                    userLikeArray = userLikeArray.split(",")
                    let pos = userLikeArray.indexOf(logUser);   //je recherche sont index dans le tableau de la BDD
                    userLikeArray.splice(pos, 1);               // et je le supprime a partir de son index
                    userLikeArray = userLikeArray.join(",")

                    comment.update({ likes: unLike, usersLiked: userLikeArray, id: req.body.id }) //update de la BDD avec le tableau modifié
                        .then(() => res.status(200).json({ message: 'like supprimé !' }))
                        .catch(error => res.status(400).json({ error }));

                }
                else {
                    if (userLikeArray == null) {               //si personne a like le post on rajouter le logUser
                        comment.update({ likes: like, usersLiked: logUser, id: req.body.id })
                            .then(() => res.status(200).json({ message: 'Vous avez liké !' }))
                            .catch(error => res.status(400).json({ error }));
                    } else {                                    // sinon on l'ajoute au tableau existant

                        userLikeArray = userLikeArray.split(",")
                        userLikeArray.push(logUser);
                        userLikeArray = userLikeArray.join(",")

                        comment.update({ likes: like, usersLiked: userLikeArray, id: req.body.id })
                            .then(() => res.status(200).json({ message: 'Vous avez liké !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                }
            }

            if (frontLike === -1) {
                console.log("j'aime pas");

                if (userLikeArray.includes(logUser)) {
                    return res.status(401).json({ message: 'vous avez deja like cette publication !' })
                }
                if (userDislikeArray.includes(logUser)) {

                    userDislikeArray = userDislikeArray.split(",")
                    let pos = userDislikeArray.indexOf(logUser);     //je recherche sont index dans le tableau de la BDD
                    userDislikeArray.splice(pos, 1);                // et je le supprime a partir de son index
                    userDislikeArray = userDislikeArray.join(",")

                    comment.update({ dislikes: unDislike, usersDisliked: userDislikeArray, id: req.body.id }) //update de la BDD avec le tableau modifié
                        .then(() => res.status(200).json({ message: 'dislike supprimé !' }))
                        .catch(error => res.status(400).json({ error }));

                }
                else {
                    if (userDislikeArray == null) {
                        comment.update({ dislikes: dislike, usersDisliked: logUser, id: req.body.id })
                            .then(() => res.status(200).json({ message: ' Vous avez disliké ! !' }))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        userDislikeArray = userDislikeArray.split(",")
                        userDislikeArray.push(logUser);
                        userDislikeArray = userDislikeArray.join(",")

                        comment.update({ dislikes: dislike, usersDisliked: userDislikeArray, id: req.body.id })
                            .then(() => res.status(200).json({ message: 'Vous avez disliké !' }))
                            .catch(error => res.status(400).json({ error }));
                    }

                }
            }


        })
        .catch(error => res.status(404).json({ message: "commentaire non trouvé" }))

};

exports.deleteJoinComment = (req, res, next) => {
    Comment.findOne({ where: { publicationId: req.params.id } }).then(
        (lecommentaire) => {
            if (!lecommentaire) {
                res.status(404).json({
                    error: new Error('No such Thing!')
                });
            }
            if (lecommentaire.image) {
                const filename = lecommentaire.image.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Comment.destroy({ where: { publicationId: req.params.id } })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                });

            } else {
                Comment.destroy({ where: { publicationId: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }

        })
        .catch(error => res.status(500).json({ error }));
};

exports.deleteComment = (req, res, next) => {
    User.findOne({ where: { id: req.auth.userId } })
        .then(function (user) {
            Comment.findOne({ where: { id: req.params.id } }).then(
                (lecommentaire) => {
                    if (!lecommentaire) {
                        res.status(404).json({
                            error: new Error('No such Thing!')
                        });
                    }
                    if ((lecommentaire.utilisateurId !== req.auth.userId) && (user.role == "user")) {
                        res.status(403).json({
                            message: "vous n'etes pas autorisé a supp"
                        });
                    }
                    if ((lecommentaire.utilisateurId === req.auth.userId) || (user.role == "admin")) {

                        if (lecommentaire.image) {
                            const filename = lecommentaire.image.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {
                                Comment.destroy({ where: { id: req.params.id } })
                                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                                    .catch(error => res.status(400).json({ error }));
                            });

                        } else {
                            Comment.destroy({ where: { id: req.params.id } })
                                .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                                .catch(error => res.status(400).json({ error }));
                        }
                    }

                })
                .catch(error => res.status(500).json({ message: "aucune condition de delete remplie" }));
        })
        .catch(error => res.status(400).json({ error }));
};
