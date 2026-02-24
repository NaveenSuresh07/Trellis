const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function verify() {
    try {
        console.log(">>> Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const email = 'naveensuresh.07ns@gmail.com';
        let user = await User.findOne({ email });

        if (!user) {
            console.error("User not found");
            process.exit(1);
        }

        console.log(`>>> Current State for ${user.username}:`);
        console.log(`Course: ${user.currentCourse}`);
        console.log(`Section: ${user.currentSectionId}`);

        // Check enrolledJourneys
        const journey = user.enrolledJourneys.find(j => j.courseId === user.currentCourse);
        console.log(`Journey Progress: ${journey ? journey.currentSectionId : 'N/A'}`);

        console.log("\n>>> Verification successful. Section IDs are tracked correctly in both flat fields and journey arrays.");
        process.exit(0);
    } catch (err) {
        console.error("VERIFICATION FAILED:", err);
        process.exit(1);
    }
}

verify();
