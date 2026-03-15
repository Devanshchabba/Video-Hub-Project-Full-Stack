import multer from  'multer'

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // directory to save
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const upload = multer({ 
    storage,
 })

