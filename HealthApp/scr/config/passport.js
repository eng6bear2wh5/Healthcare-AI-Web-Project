const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const UserModel = require('../app/models/user');
require('dotenv').config();

// ✅ Hàm tạo JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// ✅ Cấu hình Google OAuth (Không dùng session)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await UserModel.findByEmail(profile.emails[0].value);
        if (!user) {
            user = await UserModel.create(profile.displayName, null, profile.emails[0].value, true);
        }
        const token = generateToken(user);
        return done(null, { user, token });
    } catch (err) {
        return done(err, null);
    }
}));

// ✅ Cấu hình Facebook OAuth (Không dùng session)
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
        let user = await UserModel.findByEmail(email);
        if (!user) {
            user = await UserModel.create(profile.displayName, null, email, true);
        }
        const token = generateToken(user);
        return done(null, { user, token });
    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;
