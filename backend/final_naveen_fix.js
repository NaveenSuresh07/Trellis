const mongoose = require('C:/Users/navee/trellis/backend/node_modules/mongoose');

const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function finalNaveenFix() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const user = await User.findOne({ username: /Naveen/i });

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        console.log("Found user:", user.username);

        // Find Javascript journey
        const journeys = user.enrolledJourneys || [];
        const jsIndex = journeys.findIndex(j => j.courseId === 'javascript');

        if (jsIndex > -1) {
            // ALIGN: Set Journey S:1 to match Top-Level S:1
            // Preserve MaxS: 2 (if it was mastered)
            const currentMax = journeys[jsIndex].maxSectionId || 2;

            const updatePath = `enrolledJourneys.${jsIndex}.currentSectionId`;
            const maxPath = `enrolledJourneys.${jsIndex}.maxSectionId`;

            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        [updatePath]: 1,
                        [maxPath]: currentMax,
                        currentSectionId: 1
                    }
                }
            );
            console.log(`✅ Successfully aligned ${user.username}'s Javascript journey to Section 1.`);
        } else {
            console.log("Javascript journey not found in record.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

finalNaveenFix();
