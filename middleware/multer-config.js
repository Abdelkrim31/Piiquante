// on importe multer
const multer = require('multer');

// on définit les images/formats reçus en appartenance de format
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// multer.diskStorage on va enregistrer sur le disque
const storage = multer.diskStorage({
   // on choisit la destination
    destination: (req, file, callback) => {
      // null veut dire qu'il n'y a pas eu d'erreur à ce niveau la et 'images' c'est le nom du dossier
        callback(null, 'images')
    },
    // on definit les termes de son appel (nom)
    filename: (req, file, callback) => {
      // nom d'origine du fichier que l'ont transforme si il y a des espaces, on crée un tableau et on join ses éléments par _
        const name = file.originalname.split('.')[0].split(' ').join('_');
        // permet de créer une extension de fichiers correspondant au mimetype (via dictionnaire) envoyé par le frontend
        const extension = MIME_TYPES[file.mimetype];
        // aura son nom associé à une date (pour le rendre le plus unique possible) et un point et son extension
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
})
// on exporte le fichier via multer qui possède l'objet storage puis .single qui signifie fichier unique
module.exports = multer({ storage }).single('image');


