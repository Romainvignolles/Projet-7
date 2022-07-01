const bcrypt = require('bcrypt');
const User = require('../models/').user;
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {

    if (req.body.pseudo !== ("") && req.body.email !== ("") && req.body.password !== ("")) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    pseudo: req.body.pseudo,
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur crée!' }))
                    .catch(error => { res.status(400).json({ error }) });
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(500).json({ message: 'Champs invalide' })

    }


};

exports.login = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }

                    res.status(200).json({
                        email: user.email,
                        pseudo: user.pseudo,
                        userId: user.id,
                        role: user.role,
                        image: user.image,
                        token: jwt.sign(
                            { userId: user.id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )

                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.modifyUser = (req, res, next) => {
    if (req.body.pseudo !== ("") && req.body.email !== ("")) {
        const thingObject = req.file ?
            {
                pseudo: req.body.pseudo,
                email: req.body.email,
                image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
        User.update({ ...thingObject }, { where: { id: req.params.id } })
            .then(() => res.status(200).json({ thingObject }))
            .catch(error => res.status(400).json({ error }));
    } else {
        res.status(500).json({ message: 'Champs invalide' })

    }
};

exports.deleteUser = (req, res, next) => {
            User.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Compte supprimé' }))
                .catch(error => res.status(400).json({ error }));
};



