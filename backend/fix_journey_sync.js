const mongoose = require('mongoose');

// --- DB CONFIG ---
const MONGO_URI = 'mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0';

async function syncAllProgress() {
    try {
        console.log(">>> Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

        const users = await User.find({});
        console.log(`>>> Found ${users.length} users. Starting resync...`);

        let modifiedCount = 0;
        for (const user of users) {
            const currentCourse = user.currentCourse;
            if (!currentCourse) continue;

            const journeys = user.enrolledJourneys || [];
            const targetJourney = journeys.find(j => {
                const cId = (j.courseId || "").toLowerCase();
                const target = currentCourse.toLowerCase();
                return cId === target || cId.includes(target) || target.includes(cId);
            });

            if (targetJourney) {
                const needsSectionSync = user.currentSectionId !== targetJourney.currentSectionId;
                const needsProgressSync = user.progress !== targetJourney.progress;

                if (needsSectionSync || needsProgressSync) {
                    await User.updateOne(
                        { _id: user._id },
                        {
                            $set: {
                                currentSectionId: targetJourney.currentSectionId || 1,
                                progress: targetJourney.progress || 0
                            }
                        }
                    );
                    modifiedCount++;
                    console.log(`[SYNC] ${user.username || user.email}: ${currentCourse} -> Section ${targetJourney.currentSectionId}, Progress ${targetJourney.progress}`);
                }
            } else {
                // If course is set but no journey exists, create a default journey to avoid future resets
                await User.updateOne(
                    { _id: user._id },
                    {
                        $push: { enrolledJourneys: { courseId: currentCourse.toLowerCase(), currentSectionId: user.currentSectionId || 1, progress: user.progress || 0 } }
                    }
                );
                modifiedCount++;
                console.log(`[INIT] ${user.username || user.email}: Created missing journey for ${currentCourse}`);
            }
        }

        console.log(`>>> Resync completed. ${modifiedCount} users updated.`);
        process.exit(0);
    } catch (err) {
        console.error("FATAL ERROR during resync:", err);
        process.exit(1);
    }
}

syncAllProgress();
