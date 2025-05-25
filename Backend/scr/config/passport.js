const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { generateToken } = require('../helpers/tokenHelper');
const User = require('../app/models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: '/auth/google/callback' 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                googleId: profile.id,
                name: profile.displayName,
                provider: "google"
            });
        }
        else {
            if (!user.googleId) {
                user.googleId = profile.id;
                user.provider = "google"
                await user.save();
            }
        }
        const token = generateToken(user);
        return done(null, { user, token }); 
    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;
