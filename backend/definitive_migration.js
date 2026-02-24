const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

const TITLE_MAPPING = {
    "Bit Antroid's Apprentice": "Yip's Recruit",
    "BIT ANTROID'S APPRENTICE": "Yip's Recruit",
    "Code Crusader": "Trellis Voyager",
    "Loop Legend": "Consistency Vine",
    "Motivator": "Yip's Archivist",
    "Byte Master": "Trellis Master",
    "Algorithm Architect": "Algorithm Arborist",
    "Coddy Innovator": "Flash Bloomer",
    "Code Oracle": "Ancient Trellis Root",
    "Quantum Coder": "Celestial Trellis"
};

async function definitiveMigrate() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({
            username: String,
            selectedTitle: String,
            unlockedTitles: [String]
        }, { strict: false, collection: 'users' }));

        const users = await User.find({});
        console.log(`>>> Found ${users.length} users. Running definitive migration...`);

        let updatedCount = 0;
        for (const user of users) {
            let changed = false;

            // 1. Fix missing or legacy selectedTitle
            let currentSelected = user.selectedTitle;
            if (!currentSelected || currentSelected === "undefined" || TITLE_MAPPING[currentSelected]) {
                currentSelected = TITLE_MAPPING[currentSelected] || "Yip's Recruit";
                changed = true;
            }

            // 2. Fix unlockedTitles
            let currentUnlocked = user.unlockedTitles || [];
            if (currentUnlocked.length === 0) {
                currentUnlocked = ["Yip's Recruit"];
                changed = true;
            } else {
                const mapped = currentUnlocked.map(t => TITLE_MAPPING[t] || t);
                if (TITLE_MAPPING["Bit Antroid's Apprentice"] && !mapped.includes("Yip's Recruit")) {
                    // Ensure migration of base title
                    if (currentUnlocked.includes("Bit Antroid's Apprentice")) {
                        changed = true;
                    }
                }

                const finalUnlocked = [...new Set(mapped.map(t => t === "Bit Antroid's Apprentice" ? "Yip's Recruit" : t))];
                if (JSON.stringify(finalUnlocked) !== JSON.stringify(currentUnlocked)) {
                    currentUnlocked = finalUnlocked;
                    changed = true;
                }
            }

            if (changed) {
                await User.updateOne(
                    { _id: user._id },
                    { $set: { selectedTitle: currentSelected, unlockedTitles: currentUnlocked } }
                );
                updatedCount++;
                console.log(`[MIGRATED] User: ${user.username}, Selected: ${currentSelected}`);
            }
        }

        console.log(`>>> Definitive migration complete. ${updatedCount} users updated.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

definitiveMigrate();
