const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function deepDiag() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const user = await User.findOne({ username: /Naveen/i });

        console.log("=== USER PROFILE ===");
        console.log("Username:", user.username);
        console.log("XP:", user.xp);
        console.log("Current Course (Flat):", user.currentCourse);
        console.log("Current Section (Flat):", user.currentSectionId);
        console.log("Progress (Flat):", user.progress);

        console.log("\n=== ENROLLED JOURNEYS ===");
        user.enrolledJourneys.forEach((j, i) => {
            console.log(`Journey [${i}]:`);
            console.log(`  CourseId: "${j.courseId}"`);
            console.log(`  Section: ${j.currentSectionId}`);
            console.log(`  Progress: ${j.progress}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

deepDiag();
