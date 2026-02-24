const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const user = await User.findOne({ email: 'naveensuresh.07ns@gmail.com' });

        let output = "--- USER DATA --- \n";
        if (user) {
            output += `User: ${user.username}\n`;
            output += `Unlocked: ${JSON.stringify(user.unlockedTitles)}\n`;
            output += `Selected: ${user.selectedTitle}\n`;
            output += `XP: ${user.xp}\n`;
            output += `Streak: ${user.streak}\n`;
        } else {
            output += "User not found\n";
        }

        fs.writeFileSync('title_check.txt', output);
        console.log("Results written to title_check.txt");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
