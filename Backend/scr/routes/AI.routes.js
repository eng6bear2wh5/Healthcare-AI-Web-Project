const express = require('express')
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const { predictDisease, askToChatbot, uploadToChatbot } = require('../app/controllers/AI.controller');
const { protect } = require("../middleware/auth")

const TEMP_UPLOAD_DIR = path.join(__dirname, '../../uploads');
fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true })
    .catch(err => console.error("Failed to create temp upload dir:", err));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`); // Sanitize filename
    }
});
const upload = multer({ storage: storage });

router.post('/image_detection', upload.single('image'), predictDisease);
router.post('/ask', protect, askToChatbot);
router.post('/upload', protect, upload.single('image'), uploadToChatbot);

module.exports = router;