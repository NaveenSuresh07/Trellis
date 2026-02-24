const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function focusedDiag() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const user = await User.findOne({ username: /Naveen/i });

        console.log("=== FOCUSED JOURNEY DATA ===");
        console.log("Username:", user.username);
        console.log("CurrentCourse (Flat):", user.currentCourse);
        console.log("CurrentSectionId (Flat):", user.currentSectionId);
        console.log("Progress (Flat):", user.progress);

        console.log("\nEnrolledJourneys:");
        user.enrolledJourneys.forEach(j => {
            console.log(`- Course: ${j.courseId}, Section: ${j.currentSectionId}, MaxSection: ${j.maxSectionId}, Progress: ${j.progress}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

focusedDiag();
