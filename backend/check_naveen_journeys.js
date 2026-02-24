const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function checkNaveen() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const user = await User.findOne({ username: /Naveen/i });

        console.log("USER:", user.username);
        console.log("CURRENT COURSE:", user.currentCourse);
        console.log("ENROLLED JOURNEYS:");
        user.enrolledJourneys.forEach(j => {
            console.log(`- ID: "${j.courseId}", Section: ${j.currentSectionId}, Progress: ${j.progress}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkNaveen();
