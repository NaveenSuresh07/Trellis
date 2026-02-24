const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

const TITLE_MAPPING = {
    "Bit Antroid's Apprentice": "Yip's Recruit",
    "Code Crusader": "Trellis Voyager",
    "Loop Legend": "Consistency Vine",
    "Motivator": "Yip's Archivist",
    "Byte Master": "Trellis Master",
    "Algorithm Architect": "Algorithm Arborist",
    "Coddy Innovator": "Flash Bloomer",
    "Code Oracle": "Ancient Trellis Root",
    "Quantum Coder": "Celestial Trellis"
};

async function migrateBranding() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({
            selectedTitle: String,
            unlockedTitles: [String]
        }, { strict: false, collection: 'users' }));

        const users = await User.find({});
        console.log(`>>> Found ${users.length} users. Migrating branding...`);

        let updatedCount = 0;
        for (const user of users) {
            let changed = false;
            let newSelectedTitle = user.selectedTitle;
            let newUnlockedTitles = user.unlockedTitles || [];

            if (TITLE_MAPPING[user.selectedTitle]) {
                newSelectedTitle = TITLE_MAPPING[user.selectedTitle];
                changed = true;
            }

            const mappedUnlocked = newUnlockedTitles.map(t => TITLE_MAPPING[t] || t);
            if (JSON.stringify(mappedUnlocked) !== JSON.stringify(newUnlockedTitles)) {
                newUnlockedTitles = [...new Set(mappedUnlocked)];
                changed = true;
            }

            if (changed) {
                await User.updateOne(
                    { _id: user._id },
                    { $set: { selectedTitle: newSelectedTitle, unlockedTitles: newUnlockedTitles } }
                );
                updatedCount++;
                console.log(`[UPDATED] ${user.username || user.email}: Branding migrated.`);
            }
        }

        console.log(`>>> Migration complete. ${updatedCount} users updated.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrateBranding();
