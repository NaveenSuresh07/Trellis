const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function checkTitles() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({
            username: String,
            selectedTitle: String,
            unlockedTitles: [String]
        }, { strict: false, collection: 'users' }));

        const users = await User.find({});
        console.log("=== USER TITLES ===");
        users.forEach(u => {
            console.log(`User: ${u.username}`);
            console.log(`  Selected: "${u.selectedTitle}"`);
            console.log(`  Unlocked: ${JSON.stringify(u.unlockedTitles)}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTitles();
