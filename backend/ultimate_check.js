const mongoose = require('C:/Users/navee/trellis/backend/node_modules/mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function checkNaveen() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const user = await User.findOne({ username: /Naveen/i });

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        console.log("=== NAVEEN DB SNAPSHOT ===");
        console.log("Username:", user.username);
        console.log("Top-Level currentCourse:", user.currentCourse);
        console.log("Top-Level currentSectionId:", user.currentSectionId);
        console.log("Top-Level progress:", user.progress);

        console.log("\n--- ENROLLED JOURNEYS ---");
        (user.enrolledJourneys || []).forEach((j, i) => {
            console.log(`[${i}] ${j.courseId}: S:${j.currentSectionId} P:${j.progress} MaxS:${j.maxSectionId}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkNaveen();
