const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function fixNaveen() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const user = await User.findOne({ username: /Naveen/i });

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        console.log("Found user:", user.username);

        // Target: JavaScript journey
        const jIndex = user.enrolledJourneys.findIndex(j =>
            j.courseId && j.courseId.toLowerCase().trim() === 'javascript'
        );

        if (jIndex > -1) {
            const updateObj = {};
            // Force journey status to S:2, P:0 to match flat fields
            updateObj[`enrolledJourneys.${jIndex}.currentSectionId`] = 2;
            updateObj[`enrolledJourneys.${jIndex}.progress`] = 0;

            // Also ensure flat fields are correct
            updateObj.currentSectionId = 2;
            updateObj.progress = 0;
            updateObj.currentCourse = "javascript";

            await User.updateOne({ _id: user._id }, { $set: updateObj });
            console.log("✅ Fixed JavaScript journey for Naveen: Set to S:2, P:0");
        } else {
            console.log("JavaScript journey not found in enrolledJourneys");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixNaveen();
