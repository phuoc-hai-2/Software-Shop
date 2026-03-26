const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (['.pdf', '.doc', '.docx', '.txt'].includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
  else cb(new Error('Chỉ cho phép file PDF, Word, TXT'));
};

module.exports = multer({ storage, fileFilter });
