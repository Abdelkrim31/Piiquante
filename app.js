// ce fichier app.js contiendra l'application
// appel de express 
const express = require("express");
// constante app qui sera notre application; ça permet de créer une application express
const app = express();
// appel de helmet, il est utilisé pour sécuriser les en-têtes http. 
const helmet = require("helmet");
// appel de dotenv qui stocke des variables d'environnement et ça servira pour l'appel mongodb en dessous.
require("dotenv").config({ path: "./config/.env" });

// on importe saucesRoutes
const saucesRoutes = require("./routes/sauce");
// on importe userRoutes
const userRoutes = require("./routes/user");
// on importe path, donne accés au chemin du système de fichiers
const path = require("path");

//--------------------------------------------------------------------------------
//Ajout du chemin statique à l'application pour fournir les images
app.use('/images', express.static(path.join(__dirname, 'images'))); 
//--------------------------------------------------------------------------------

// middleware d'helmet
app.use(helmet());

//----------------------------------------------------------------------------------
// CORS
//----------------------------------------------------------------------------------
// Le CORS définit comment les serveurs et les navigateurs interagissent, 
//en spécifiant quelles ressources peuvent être demandées de manière légitime
app.use((req, res, next) => {
  // origine, droit d'accéder c'est tout le monde '*'
  res.setHeader("Access-Control-Allow-Origin", "*");
  // headers, ce sont les headers acceptés (en-tête)
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // methods,  ce sont les méthodes acceptées 
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});
//----------------------------------------------------------------------
// middleware intercepte la requete et la transforme au bon format
app.use(express.json());

//----------------------------------------------------------------------------------
// MIDDLEWARE DEBUT DE ROUTE
//----------------------------------------------------------------------------------
// pour cette route la on utilise le router de userRoutes
app.use("/api/auth", userRoutes);
// pour cette route la on utilise le router de saucesRoutes
app.use("/api/sauces", saucesRoutes);
// on exporte cette constante pour pouvoir y acceder depuis d'autres fichiers
module.exports = app;

//----------------------------------------------------------------------------------
//Connexion à MongoDB
//----------------------------------------------------------------------------------
const mongoose = require('mongoose');
// Mongoose est un package qui facilite les interactions avec notre base de données MongoDB. 
  mongoose.connect(
    "mongodb+srv://" +
      process.env.MONGO_DB_USER +
      ":" +
      process.env.MONGO_DB_USER_MDP +
      "@cluster0.ppue7ju.mongodb.net/" +
      process.env.MONGO_DB_MARQUE,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



