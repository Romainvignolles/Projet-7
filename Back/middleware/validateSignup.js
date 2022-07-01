module.exports = (req, res, next) => {
    try {
        validate = true;
        if (!/^[a-zA-Z0-9-_\.]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]+$/.test(req.body.email)) {
            validate = false;
          }
        if (validate === true) {
            next();
        }
        else {
            res.status(403).json({ message:'l\'adresse mail est invalide'});

        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};