const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for social users
    googleId: { type: String },
    githubId: { type: String },
    major: String,
    year: String,
    skillsToLearn: [String],
    skillsToTeach: [String],
    onboardingGoal: String,
    onboardingLevel: String,
    onboardingCommitment: String,
    onboardingLanguage: String,
    currentCourse: String,
    currentSectionId: { type: Number, default: 1 },
    progress: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    xpToday: { type: Number, default: 0 },
    exercisesCompletedToday: { type: Number, default: 0 },
    firstTrySolves: { type: Number, default: 0 },
    summariesToday: { type: Number, default: 0 },
    sectionsMasteredToday: { type: Number, default: 0 },
    enrolledJourneys: [{
        courseId: String,
        currentSectionId: { type: Number, default: 1 },
        maxSectionId: { type: Number, default: 1 },
        progress: { type: Number, default: 0 },
        lastAccessed: { type: Date, default: Date.now }
    }],
    lastActivity: { type: Date, default: Date.now },
    activityDays: { type: [String], default: [] },
    bio: { type: String, default: '' },
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        x: { type: String, default: '' },
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        website: { type: String, default: '' },
        youtube: { type: String, default: '' }
    },
    dob: { type: String, default: '' },
    isPrivate: { type: Boolean, default: false },
    selectedTitle: { type: String, default: "Yip's Recruit" },
    unlockedTitles: { type: [String], default: ["Yip's Recruit"] },
    notes: [{ content: String, summary: String }]
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);