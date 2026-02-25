const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    // Google Strategy
    const gClientID = (process.env.GOOGLE_CLIENT_ID || '').trim();
    const gClientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();

    console.log(`[AUTH DEBUG] Initializing Google Strategy with ID: ${gClientID.substring(0, 10)}...${gClientID.substring(gClientID.length - 5)}`);

    let backendURL = (process.env.BACKEND_URL || '').replace(/\/$/, '');

    // Force HTTPS if backendURL is provided
    if (backendURL && !backendURL.startsWith('http')) {
        backendURL = `https://${backendURL}`;
    } else if (backendURL.startsWith('http://')) {
        backendURL = backendURL.replace('http://', 'https://');
    }

    const googleCallback = backendURL
        ? `${backendURL}/api/auth/google/callback`
        : '/api/auth/google/callback';

    passport.use(new GoogleStrategy({
        clientID: gClientID || 'PLACEHOLDER',
        clientSecret: gClientSecret || 'PLACEHOLDER',
        callbackURL: googleCallback
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value
        };

        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    // Link google account to existing email
                    user.googleId = profile.id;
                    await user.save();
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));

    const githubCallback = backendURL
        ? `${backendURL}/api/auth/github/callback`
        : '/api/auth/github/callback';

    // GitHub Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID || 'PLACEHOLDER',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'PLACEHOLDER',
        callbackURL: githubCallback
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            githubId: profile.id,
            username: profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`
        };

        try {
            let user = await User.findOne({ githubId: profile.id });
            if (user) {
                done(null, user);
            } else {
                // Check by email if available
                const email = profile.emails?.[0]?.value;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.githubId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
