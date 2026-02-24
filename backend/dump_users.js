const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function dumpUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

        const users = await User.find({});
        fs.writeFileSync('users_diagnose.json', JSON.stringify(users, null, 2));
        console.log("Dumped all users to users_diagnose.json");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpUsers();
