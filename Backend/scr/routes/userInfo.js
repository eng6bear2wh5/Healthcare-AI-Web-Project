// // routes/userInfo.js
const express = require('express');
const router  = express.Router();
const UserInfo = require('../app/models/UserInfo');
const { protect, authorize } = require('../middleware/auth');

/**
 * TEST MODE endpoints (không cần JWT, dùng ?userId=…)
//  */
// // GET /api/userinfo/test?userId=<id>
// router.get('/test', async (req, res, next) => {
//   try {
//     const userId = req.query.userId;
//     if (!userId) return res.status(400).json({ message: 'Thiếu userId' });
//     const ui = await UserInfo.findOne({ user_id: userId }).lean();
//     if (!ui) return res.status(404).json({ message: 'Chưa có thông tin UserInfo' });
//     res.json(ui);
//   } catch (err) { next(err); }
// });

// // PUT /api/userinfo/test?userId=<id>
// router.put('/test', async (req, res, next) => {
//   try {
//     const userId = req.query.userId;
//     if (!userId) return res.status(400).json({ message: 'Thiếu userId' });
//     const ui = await UserInfo.findOneAndUpdate(
//       { user_id: userId },
//       req.body,
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     ).lean();
//     res.json(ui);
//   } catch (err) { next(err); }
// });


/**
 * PRODUCTION MODE endpoints (có JWT)
 */
// GET /api/userinfo
router.get('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const ui = await UserInfo.findOne({ user_id: req.user.id }).lean();
    if (!ui) return res.status(404).json({ message: 'Chưa có thông tin UserInfo' });
    res.json(ui);
  } catch (err) { next(err); }
});

// PUT /api/userinfo
router.put('/', protect, authorize('user'), async (req, res, next) => {
  try {
    const ui = await UserInfo.findOneAndUpdate(
      { user_id: req.user.id },
      { ...req.body, user_id: req.user.id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    res.json(ui);
  } catch (err) { next(err); }
});

module.exports = router;

