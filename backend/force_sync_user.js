const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function forceSync() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

        const username = "Naveen suresh";
        const update = {
            $set: {
                unlockedTitles: [
                    "Yip's Recruit",
                    "Trellis Voyager",
                    "Consistency Vine",
                    "Flash Bloomer",
                    "Trellis Master"
                ],
                selectedTitle: "Trellis Master",
                currentCourse: "javascript",
                currentSectionId: 1,
                progress: 2,
                streak: 2,
                xp: 520
            }
        };

        const result = await User.updateOne({ username: /Naveen/i }, update);
        console.log(`>>> Force Sync result:`, result);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

forceSync();
