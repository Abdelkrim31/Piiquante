// on appelle le modèle de la sauce
const Sauce = require('../models/sauce');
// on appelle fs (filesystem) qui permet d'aller dans les fichiers
const fs = require('fs');

//----------------------------------------------------------------------------------
// LOGIQUE GETALLSAUCE
//----------------------------------------------------------------------------------
// accède à toutes les sauces
// une personne avec un webtokenvalide accède à ces informations puisque seulement le token identifie et donne accès
exports.getAllSauce = (req, res, next) => {
    // on veut la liste complète des Sauces alors on utilise find() sans argument
    Sauce.find()
    //  status 200 OK et sauces en json
    .then(sauces => res.status(200).json(sauces))
    // erreur un status 400 Bad Request et l'erreur en json
    .catch(error => res.status(400).json({ error }));
};

//----------------------------------------------------------------------------------
// LOGIQUE GETONESAUCE
//----------------------------------------------------------------------------------
// accède à une sauce
// une personne avec un webtokenvalide accède à ces informations puisque seulement le token identifie et donne accés
exports.getOneSauce = (req, res, next) => {
    // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//----------------------------------------------------------------------------------
// LOGIQUE CREATESAUCE
//----------------------------------------------------------------------------------
// créer une sauce
exports.createSauce = (req, res, next) => {
    // on extrait la sauce de la requete via le parse
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // déclaration de sauce qui sera une nouvelle instance du modele Sauce qui contient toutes les informations dont on a besoin
    const sauce = new Sauce({
        // raccourci spread pour récupérer toutes les données de req.body ( title, description...)
        ...sauceObject,
        // l'image url correspont au protocole avec :// puis la valeur du port (host) dans le dossier images qui a le nom
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    // enregistre l'objet dans la base de données
    sauce.save()
    // retourne une promesse, il faut une réponse sinon il y a expiration de la requete donc un status 201 Created pour bonne 
    // création de ressource + message
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        // en cas d'erreur on renvoit un status 400 Bad Request et l'erreur
        .catch(error => {
            console.log(json({ error }));
            res.status(400).json({ error });
        });
};

//----------------------------------------------------------------------------------
// LOGIQUE MODIFYSAUCE
//----------------------------------------------------------------------------------
exports.modifySauce = (req, res, next) => {
    if (req.file) {
//// si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image :
        Sauce.findOne({ _id: req.params.id }) // l'id de la sauce est l'id user dans l'url
            // si la sauce existe
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                // on efface le fichier image qui doit se faire remplacer
                fs.unlink(`images/${filename}`, () => {

        //// une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste :
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    // modifie une sauce dans la base de données, 
                    //1er argument c'est l'objet qu'on modifie avec id correspondant à l'id de la requete
                    // et le deuxième argument c'est la nouvelle version de l'objet qui contient la sauce qui est dans 
                    //le corps de la requete et que _id correspond à celui des paramètres
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
//// si l'image n'est pas modifiée :
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};

//----------------------------------------------------------------------------------
// LOGIQUE DELETESAUCE
//----------------------------------------------------------------------------------
// effacer une sauce
exports.deleteSauce = (req, res, next) => {
    // trouve dans les sauce un _id correspondant à l'id de la requete
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // on créait un tableau via l'url et en séparant la partie '/images' et ensuite on recupère 
            // l'indice 1 du tableau qui est le nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            // unlink va supprimer le fichier image de la sauce concernée dans le dossier image
            fs.unlink(`images/${filename}`, () => {
            // effacera un sauce et son _id sera la comparaison avec l'id des paramètres de la requete (paramètre de route)
                Sauce.deleteOne({ _id: req.params.id })
                 // retourne une promesse status 200 OK et message en json
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                // si erreur status 400 Bad Request et erreur en json
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

//----------------------------------------------------------------------------------
// LOGIQUE LIKE / DISLIKE SAUCE
//----------------------------------------------------------------------------------
// like une sauce
exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            // nouvelles valeurs à modifier
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            // Différents cas:
            switch (like) {
                case 1:  // CAS: sauce liked
                    newValues.usersLiked.push(userId);
                    break;
                case -1:  // CAS: sauce disliked
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:  // CAS: Annulation du like/dislike
                    if (newValues.usersLiked.includes(userId)) {
                        // si on annule le like
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        // si on annule le dislike
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            };
            // Calcul du nombre de likes / dislikes
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;
            // Mise à jour de la sauce avec les nouvelles valeurs
            Sauce.updateOne({ _id: sauceId }, newValues )
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }));
}

