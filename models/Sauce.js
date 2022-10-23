// package mangoose pour créer un schéma et on a besoin de l'importer
const mongoose = require('mongoose');
// création d'un schéma de données qui contient les champs souhaités pour chaque Sauce
// indique leur type ainsi que leur caractère (obligatoire ou non) grace à la méthode Schema mise à disposition par Mongoose
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true }
});
// nous exportons ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express
module.exports = mongoose.model('Sauce', sauceSchema);

