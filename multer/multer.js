const multer  = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/jpg|jpeg|png|$i/)) {
    cb(new Error('File is not supported'), false)
    return
    }
    cb(null, true);
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024*1024*5},
    fileFilter: fileFilter
})

module.exports=upload;