const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function diagnose() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

        const users = await User.find({ username: /Naveen/i });
        const results = users.map(user => ({
            ID: user._id,
            Username: user.username,
            Email: user.email,
            XP: user.xp,
            Streak: user.streak,
            UnlockedTitles: user.unlockedTitles,
            EnrolledJourneysCount: user.enrolledJourneys ? user.enrolledJourneys.length : 0,
            CurrentCourse: user.currentCourse,
            LastActivity: user.lastActivity
        }));

        fs.writeFileSync('diag_result.json', JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('diag_result.json', JSON.stringify({ error: err.message }, null, 2));
        process.exit(1);
    }
}

diagnose();
