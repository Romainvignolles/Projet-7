const Post = require('../models/').post;
const User = require('../models/').user;
const Comment = require('../models/').comment;
const fs = require('fs');


exports.createThing = (req, res, next) => {
    let image = null
    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }


    let post = new Post({
        title: req.body.title,
        textContent: req.body.textContent,
        image: image,
        utilisateurId: req.body.utilisateurId,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,

    });
    if (req.body.title !== ("") && req.body.textContent !== ("")) {

        post.save()
            .then(() => res.status(201).json({ message: 'publication ajoutée a la base de donnée!' }))
            .catch(error => res.status(400).json({ error: error }))
    } else {
        res.status(500).json({ message: 'Champs invalide' })
    }
};

exports.getAllStuff = (req, res, next) => {
    Post.findAll({ include: { all: true, nested: true }, order: [["createdAt", "DESC"]], })
        .then((things) => res.status(200).send(things))
        .catch((error) => res.status(400).send({ error: error }))
};

exports.modifyThing = (req, res, next) => {

    User.findOne({ where: { id: req.auth.userId } })
        .then(function (user) {
            Post.findOne({ where: { id: req.params.id } }).then(
                (lapublication) => {
                    console.log(lapublication);
                    if ((lapublication.utilisateurId == req.auth.userId) || (user.role == "admin")) {
                        const thingObject = req.file ?
                            {
                                title: req.body.title,
                                textContent: req.body.textContent,
                                image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                            } : { ...req.body };
                        Post.update({ ...thingObject }, { where: { id: req.params.id } })
                            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        res.status(403).json({
                            message: "cette publiation de vous appartient pas"
                        });
                    }

                })
                .catch(error => res.status(500).json({ error }));


        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
    User.findOne({ where: { id: req.auth.userId } })
        .then(function (user) {

            Post.findOne({ where: { id: req.params.id } }).then(
                (lapublication) => {
                    if (!lapublication) {
                        res.status(404).json({
                            error: new Error('No such Thing!')
                        });
                    }
                    if ((lapublication.utilisateurId !== req.auth.userId) && (user.role =="user")) {
                        res.status(403).json({
                            message: "vous n'etes pas autorisé a supp"
                        });
                    }
                    if ((lapublication.utilisateurId === req.auth.userId) || (user.role == "admin")) {
                        if (lapublication.image) {
                            const filename = lapublication.image.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {
                                Post.destroy({ where: { id: req.params.id } })
                                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                                    .catch(error => res.status(400).json({ error }));
                            });

                        } else {
                            Post.destroy({ where: { id: req.params.id } })
                                .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                                .catch(error => res.status(400).json({ error }));
                        }
                    }

                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};

exports.likeThing = (req, res, next) => {
    let logUser = req.body.userId;
    const frontLike = req.body.like;
    let actualLike = 0;
    let actualDislike = 0;
    ;
    Post.findOne({ where: { id: req.body.id } })               // je recherche la sauce concerné par le like/dislike
        .then((post) => {
            actualLike = post.likes;
            actualDislike = post.dislikes;
            const like = actualLike + 1;
            const dislike = actualDislike - 1;
            const unLike = actualLike - 1;
            const unDislike = actualDislike + 1
            let userLikeArray = post.usersLiked;
            let userDislikeArray = post.usersDisliked;

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

                    post.update({ likes: unLike, usersLiked: userLikeArray, id: req.body.id }) //update de la BDD avec le tableau modifié
                        .then(() => res.status(200).json({ message: 'like supprimé !' }))
                        .catch(error => res.status(400).json({ error }));

                }
                else {
                    if (userLikeArray == null) {               //si personne a like le post on rajouter le logUser
                        post.update({ likes: like, usersLiked: logUser, id: req.body.id })
                            .then(() => res.status(200).json({ message: 'Vous avez liké !' }))
                            .catch(error => res.status(400).json({ error }));
                    } else {                                    // sinon on l'ajoute au tableau existant

                        userLikeArray = userLikeArray.split(",")
                        userLikeArray.push(logUser);
                        userLikeArray = userLikeArray.join(",")

                        post.update({ likes: like, usersLiked: userLikeArray, id: req.body.id })
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

                    post.update({ dislikes: unDislike, usersDisliked: userDislikeArray, id: req.body.id }) //update de la BDD avec le tableau modifié
                        .then(() => res.status(200).json({ message: 'dislike supprimé !' }))
                        .catch(error => res.status(400).json({ error }));

                }
                else {
                    if (userDislikeArray == null) {
                        post.update({ dislikes: dislike, usersDisliked: logUser, id: req.body.id })
                            .then(() => res.status(200).json({ message: ' Vous avez disliké ! !' }))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        userDislikeArray = userDislikeArray.split(",")
                        userDislikeArray.push(logUser);
                        userDislikeArray = userDislikeArray.join(",")

                        post.update({ dislikes: dislike, usersDisliked: userDislikeArray, id: req.body.id })
                            .then(() => res.status(200).json({ message: 'Vous avez disliké !' }))
                            .catch(error => res.status(400).json({ error }));
                    }

                }
            }


        })
        .catch(error => res.status(404).json({ message: "publication non trouvé" }))

};
