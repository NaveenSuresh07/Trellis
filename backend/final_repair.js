const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function finalRepair() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const user = await User.findOne({ username: /Naveen/i });

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        const jIndex = user.enrolledJourneys.findIndex(j =>
            j.courseId && j.courseId.toLowerCase().trim() === 'javascript'
        );

        if (jIndex > -1) {
            const updateObj = {};
            // SET EVERYTHING TO SECTION 2
            updateObj[`enrolledJourneys.${jIndex}.currentSectionId`] = 2;
            updateObj[`enrolledJourneys.${jIndex}.maxSectionId`] = 2;
            updateObj[`enrolledJourneys.${jIndex}.progress`] = 0;

            updateObj.currentSectionId = 2;
            updateObj.progress = 0;
            updateObj.currentCourse = "javascript";

            await User.updateOne({ _id: user._id }, { $set: updateObj });
            console.log("✅ Final Repair Successful: Naveen set to Section 2 (Mastered)");
        } else {
            console.log("JavaScript journey not found");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

finalRepair();
