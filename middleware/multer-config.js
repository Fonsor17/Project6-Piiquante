const multer = require('multer');

// Allowed file extensions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Multer configuration
const storage = multer.diskStorage({
  //Where to save the images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //How to name the files = original filename + Date + extension
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Exporting and indicating to handle only uploaded single images
module.exports = multer({storage: storage}).single('image');