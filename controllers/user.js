// appel de bcrypt
const bcrypt = require("bcrypt");
// appel de jsonwebtoken
const jwt = require("jsonwebtoken");
// appel de model user
const User = require("../models/User");

//----------------------------------------------------------------------------------
// LOGIQUE SIGNUP
//----------------------------------------------------------------------------------
// enregistrement de nouveaux utilisateurs grace a signup
exports.signup = (req, res, next) => {
  // fonction pour hasher/crypter le mot de passe en 10 tours pour le sel
  bcrypt.hash(req.body.password, 10)
  // quand c'est hashé
    .then(hash => {
      // créer un modèle User avec email et mot de pase hashé
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // sauvegarde le user dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//----------------------------------------------------------------------------------
// LOGIQUE LOGIN
//----------------------------------------------------------------------------------
// l'identification d'utilisateur grace a login
exports.login = (req, res, next) => {
  // on trouve l'adresse qui est rentrée par un utilisateur (requete)
  User.findOne({ email: req.body.email })
    // pour un utilisateur
    .then((user) => {
      // si la requete email ne correspond pas à un utisateur
      if (!user) {
        // status 401 Unauthorized et message en json
        return res.status(401).json({ error });
      }
      // si c'est ok bcrypt compare le mot de passe de user avec celui rentré par l'utilisateur dans sa request
      bcrypt
        .compare(req.body.password, user.password)
        // à la validation
        .then((valid) => {
          // si ce n'est pas valide
          if (!valid) {
            // retourne un status 401 Unauthorized et un message en json
            return res.status(401).json({ error });
          }
          // si c'est ok status 201 Created et renvoi un objet json
          res.status(201).json({
            // renvoi l'user id
            userId: user._id,
            // renvoi un token traité/encodé
            token: jwt.sign(
              // le token aura le user id identique à la requete d'authentification
              { userId: user._id },
              // clef secrette pour l'encodage
              process.env.TOKEN_SECRET_ALEATOIRE,
              // durée de vie du token
              { expiresIn: process.env.TOKEN_TEMP }
            ),
          });
        })
        // erreur status 500 Internal Server Error et message en json
        .catch((error) => res.status(500).json({ error }));
    })
    // erreur status 500 Internal Server Error et message en json
    .catch((error) => res.status(500).json({ error }));
};
