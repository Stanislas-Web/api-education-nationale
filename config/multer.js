const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Définir l'endroit où les fichiers seront stockés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';  // Dossier où les fichiers seront stockés
    // Créer le dossier si il n'existe pas encore
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);  // Crée le dossier uploads
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Obtenir l'extension du fichier
    const filename = `${Date.now()}${ext}`; // Renommer le fichier pour éviter les conflits de nom
    cb(null, filename); // Nom final du fichier
  }
});

// Appliquer des filtres pour limiter les types de fichiers (optionnel)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accepter les fichiers images uniquement
  } else {
    cb(new Error('Le fichier doit être une image'), false); // Rejeter les autres types
  }
};

// Créer l'upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo
});

module.exports = upload;
