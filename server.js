// importer le package/module http de node
const http = require("http");
// importe le fichier de l'application 
const app = require("./app");
//----------------------------------------------------------------------------------
// GARDE CORPS SECURITE
//----------------------------------------------------------------------------------
const normalizePort = (val) => {
  //Exécute parseInt, qui convertit essentiellement la valeur en un entier
  const port = parseInt(val, 10);
  // si port n'est pas un nombre   isNaN(port)
  if (isNaN(port)) {
    // retourne val
    return val;
  }
  //  si port est un nombre sup ou égal à 0
  if (port >= 0) {
    // retourne port
    return port;
  }
  // sinon retourne faux
  return false;
};

// const port = normalizePort(process.env.PORT || '3000');
const port = normalizePort(process.env.PORT || "3000");
// indique à l'application express quelle doit tourner sur le 'port' avec la constante port
app.set("port", port);

//----------------------------------------------------------------------------------
// DIPLOMATIE DES ERREURS
//----------------------------------------------------------------------------------
const errorHandler = (error) => {
  // si le server n'entend rien à l'appel
  if (error.syscall !== "listen") {
    // lance une erreur
    throw error;
  }
  // au cas d'une erreur code
  switch (error.code) {
    // EACCES est autorisation refusée
    case "EACCES":
      console.error(error);
      // process.exit(1) signifie mettre fin au processus avec un échec. process.exit(0) signifie mettre fin au processus sans échec
      process.exit(1);
      // fin
      break;
    // EADDRINUSE veut dire que l'adresse cherchée est en cour d'utilisation
    case "EADDRINUSE":
      console.error(error);
      process.exit(1);
      //fin
      break;
    // par défaut
    default:
      // lance une erreur
      throw error;
  }
};

//----------------------------------------------------------------------------------
// SERVEUR
//----------------------------------------------------------------------------------
// on passe cette application app en argument pour créer le serveur
const server = http.createServer(app);
// si le server est en erreur appelle la fonction errorHandler qui gère les erreurs
server.on('error', errorHandler);
// un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
// attend et ecoute les requêtes envoyées; par defaut on utilise le port 3000
server.listen(port);
