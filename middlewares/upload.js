const multer = require('multer');
const path = require('path');

// Configure Local Disk Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Store files locally in 'uploads' directory
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Rename file to avoid collisions
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and Documents Only!');
  }
}

// Init disk upload
const localUpload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = { localUpload };
