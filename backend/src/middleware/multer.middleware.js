import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../public/temp');

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Always allow destination for the file
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate filename for the uploaded file
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File filter to make image upload optional
const fileFilter = (req, file, cb) => {
  // If no file is uploaded, allow the request to proceed
  if (!file) {
    cb(null, false);
    return;
  }

  // Check if the file is an image
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  // Optional: limits can be added here if needed
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});