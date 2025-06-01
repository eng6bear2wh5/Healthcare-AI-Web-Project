// routes/avatar.js
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const User    = require('../app/models/user');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Cấu hình multer để lưu vào /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.user ? req.user.id : req.query.userId}-${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// // TEST MODE: upload dùng userId query
// router.post(
//   '/avatar-test',
//   upload.single('avatarFile'),
//   async (req, res, next) => {
//     try {
//       const user = await User.findByIdAndUpdate(
//         req.query.userId,
//         { avatar: `/uploads/${req.file.filename}` },
//         { new: true }
//       ).lean();
//       res.json(user);
//     } catch (err) { next(err); }
//   }
// );

// PROD MODE: upload dùng JWT
router.post(
  '/avatar',
  protect,
  authorize('user'),
  upload.single('avatarFile'),
  async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: `/uploads/${req.file.filename}` },
        { new: true }
      ).lean();
      res.json(user);
    } catch (err) { next(err); }
  }
);

module.exports = router;
