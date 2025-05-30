const express = require('express')
const router = express.Router();
const { predictDisease } = require('../app/controllers/AI.controller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/image_detection', upload.single('image'), predictDisease);

module.exports = router;