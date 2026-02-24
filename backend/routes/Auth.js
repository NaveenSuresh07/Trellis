const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const passport = require('passport');

// --- SHARED ACHIEVEMENT TITLES CONFIG ---
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

const getEligibleTitles = (user) => {
    const xp = Number(user.xp || 0);
    const streak = Number(user.streak || 0);
    const exercisesToday = Number(user.exercisesCompletedToday || 0);

    const titles = ["Yip's Recruit"];
    if (xp >= 100) titles.push("Trellis Voyager");
    if (streak >= 2) titles.push("Consistency Vine");
    if ((user.notes?.length || 0) >= 2) titles.push("Yip's Archivist");
    if (xp >= 500) titles.push("Trellis Master");
    if (user.enrolledJourneys?.some(j => (j.progress || 0) >= 5)) titles.push("Algorithm Arborist");
    if (exercisesToday >= 3) titles.push("Flash Bloomer");
    if (streak >= 7) titles.push("Ancient Trellis Root");
    if (xp >= 1000) titles.push("Celestial Trellis");

    return titles;
};
// ----------------------------------------

// GET LEADERBOARD
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find()
            .select('username xp major year selectedTitle')
            .sort({ xp: -1 })
            .limit(20);
        res.json(users);
    } catch (err) {
        console.error('[AUTH ERROR]', err.message);
        res.status(500).send('Server Error');
    }
});

// GET USER COUNT
router.get('/users/count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('[AUTH COUNT ERROR]', err.message);
        res.status(500).send('Server Error');
    }
});

// GOOGLE OAUTH
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
});

// GITHUB OAUTH
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
});

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const {
            username, email, password, major, year, skillsToLearn, skillsToTeach,
            onboardingLanguage, onboardingGoal, onboardingLevel, onboardingCommitment
        } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            username, email, password: hashedPassword, major, year,
            skillsToLearn, skillsToTeach, onboardingLanguage, onboardingGoal,
            onboardingLevel, onboardingCommitment,
            currentCourse: onboardingLanguage || "html",
            enrolledJourneys: [{
                courseId: onboardingLanguage || "html",
                currentSectionId: 1,
                progress: 0,
                lastAccessed: new Date()
            }],
            progress: 0
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ msg: 'Welcome to Trellis!', token, user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET USER DATA
router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const dateString = now.toLocaleDateString('en-CA');
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // --- BRANDING AUTO-MIGRATION ---
        let unlocked = user.unlockedTitles || [];
        let selected = user.selectedTitle;
        let changed = false;

        // Map old names to new names
        const mappedUnlocked = unlocked.map(t => TITLE_MAPPING[t] || t);

        // Always ensure 'Yip\'s Recruit' is there
        if (!mappedUnlocked.includes("Yip's Recruit")) {
            mappedUnlocked.push("Yip's Recruit");
            changed = true;
        }

        if (JSON.stringify(mappedUnlocked) !== JSON.stringify(unlocked)) {
            unlocked = mappedUnlocked;
            changed = true;
        }
        if (selected && TITLE_MAPPING[selected]) {
            selected = TITLE_MAPPING[selected];
            changed = true;
        }

        const eligible = getEligibleTitles(user);
        const finalTitles = [...new Set([...unlocked, ...eligible])];

        const updateOps = {
            $addToSet: { activityDays: dateString },
            $set: { lastActivity: now, unlockedTitles: finalTitles }
        };

        // --- STREAK & DAILY RESET LOGIC (Moved to /me for robust tracking) ---
        const lastAct = user.lastActivity ? new Date(user.lastActivity) : null;
        if (!lastAct) {
            updateOps.$set.streak = 1;
            updateOps.$set.exercisesCompletedToday = 0;
            updateOps.$set.firstTrySolves = 0;
            updateOps.$set.summariesToday = 0;
            updateOps.$set.xpToday = 0;
            updateOps.$set.sectionsMasteredToday = 0;
        } else {
            const isToday = lastAct.toDateString() === now.toDateString();
            const isYesterday = new Date(new Date(now).setDate(now.getDate() - 1)).toDateString() === lastAct.toDateString();

            if (!isToday) {
                // It's a new day! Reset counters
                updateOps.$set.exercisesCompletedToday = 0;
                updateOps.$set.firstTrySolves = 0;
                updateOps.$set.summariesToday = 0;
                updateOps.$set.xpToday = 0;
                updateOps.$set.sectionsMasteredToday = 0;

                if (isYesterday) {
                    updateOps.$inc = { ...updateOps.$inc, streak: 1 };
                } else {
                    updateOps.$set.streak = 1; // Streak broken, restart at 1
                }
            }
        }

        if (changed || selected !== user.selectedTitle) {
            updateOps.$set.selectedTitle = selected;
        }

        // NORMALIZE & DEDUPLICATE JOURNEYS
        const journeys = user.enrolledJourneys || [];
        const normalizedJourneys = [];
        const seenCourses = new Set();
        let repairNeeded = false;

        for (const journey of journeys) {
            const rawId = journey.courseId || "";
            const normId = rawId.toLowerCase().trim();
            if (rawId !== normId) repairNeeded = true;

            if (!seenCourses.has(normId)) {
                seenCourses.add(normId);
                normalizedJourneys.push({
                    ...journey.toObject(),
                    courseId: normId
                });
            } else {
                repairNeeded = true; // Duplicate found
            }
        }

        // ROBUST PROGRESS SYNC: Consolidated logic
        if (user.currentCourse && normalizedJourneys.length > 0) {
            const currentNorm = user.currentCourse.toLowerCase().trim();
            const jIndex = normalizedJourneys.findIndex(j =>
                j.courseId && j.courseId.toLowerCase().trim() === currentNorm
            );

            if (jIndex > -1) {
                const journey = normalizedJourneys[jIndex];
                const flatS = user.currentSectionId || 1;
                const flatP = user.progress || 0;
                const journeyS = journey.currentSectionId || 1;
                const journeyP = journey.progress || 0;
                const journeyMax = journey.maxSectionId || journeyS || 1;

                // Sync Case 1: Backend Journey shows MORE progress - FOLLOW backend
                if (journeyMax > flatS || (journeyS === flatS && journeyP > flatP)) {
                    updateOps.$set.currentSectionId = journeyS;
                    updateOps.$set.progress = journeyP;
                    repairNeeded = true;
                    console.log(`[SYNC -> GLOBAL] Recovered ${user.username} - ${currentNorm} to S:${journeyS} P:${journeyP} (Max: ${journeyMax})`);
                }
                // Sync Case 2: Local Flat is NEWER - UPDATE backend record
                else if (flatS > journeyS || (flatS === journeyS && flatP > journeyP)) {
                    normalizedJourneys[jIndex].currentSectionId = flatS;
                    normalizedJourneys[jIndex].progress = flatP;
                    normalizedJourneys[jIndex].maxSectionId = Math.max(journeyMax, flatS);
                    repairNeeded = true;
                    console.log(`[SYNC -> JOURNEY] Updating Record for ${user.username} - ${currentNorm} to S:${flatS} P:${flatP}`);
                }
            }
        }

        if (repairNeeded) {
            updateOps.$set.enrolledJourneys = normalizedJourneys;
            console.log(`[REPAIR] Committed normalized/synced journeys for ${user.username}`);
        }

        // ONE-TIME BACKFILL for activity days visualization
        const currentActivityDays = user.activityDays || [];
        if (currentActivityDays.length < user.streak) {
            const streakDays = [];
            for (let i = 0; i < Math.min(user.streak, 30); i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                streakDays.push(d.toLocaleDateString('en-CA'));
            }
            updateOps.$addToSet.activityDays = { $each: streakDays };
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateOps, { new: true }).select('-password');
        console.log(`[AUTH ME] User: ${updatedUser.username}, XP: ${updatedUser.xp}, Titles: ${updatedUser.unlockedTitles.length}, Journeys: ${updatedUser.enrolledJourneys?.length || 0}`);
        res.json(updatedUser);
    } catch (err) {
        console.error('[AUTH ME ERROR]', err.message);
        res.status(500).send('Server Error');
    }
});

// UPDATE PROGRESS & ACTIVITY
router.patch('/progress', auth, async (req, res) => {
    try {
        const { currentCourse, currentSectionId, progress, xpIncrement, isFirstTry, completeSection } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const now = new Date();
        const dateString = now.toLocaleDateString('en-CA');
        const updateOps = {
            $set: { lastActivity: now },
            $inc: {},
            $addToSet: { activityDays: dateString }
        };

        // 1. Streak & Daily Resets
        const lastAct = user.lastActivity ? new Date(user.lastActivity) : null;
        if (!lastAct) {
            updateOps.$set.streak = 1;
        } else {
            const isToday = lastAct.toDateString() === now.toDateString();
            const isYesterday = new Date(new Date(now).setDate(now.getDate() - 1)).toDateString() === lastAct.toDateString();

            if (!isToday) {
                // Counters reset
                updateOps.$set.exercisesCompletedToday = 0;
                updateOps.$set.firstTrySolves = 0;
                updateOps.$set.summariesToday = 0;
                updateOps.$set.xpToday = 0;
                updateOps.$set.sectionsMasteredToday = 0;

                if (isYesterday) {
                    updateOps.$inc = { ...updateOps.$inc, streak: 1 };
                } else {
                    updateOps.$set.streak = 1;
                }
            }
        }

        // JOURNEY FLOW
        const findJourneyIndex = (courseId) => {
            if (!courseId) return -1;
            const target = courseId.toLowerCase().trim();
            return user.enrolledJourneys.findIndex(j => {
                const jim = (j.courseId || "").toLowerCase().trim();
                // STRICT MATCH to prevent 'java' matching 'javascript'
                return jim === target;
            });
        };

        if (completeSection && currentCourse) {
            const jIndex = findJourneyIndex(currentCourse);
            if (jIndex > -1) {
                const journey = user.enrolledJourneys[jIndex];
                const currentS = journey.currentSectionId || 1;
                const nxt = currentS + 1;
                const newMax = Math.max(journey.maxSectionId || 1, nxt);

                updateOps.$inc.xp = (updateOps.$inc.xp || 0) + 100;
                updateOps.$inc.xpToday = (updateOps.$inc.xpToday || 0) + 100;
                updateOps.$inc.sectionsMasteredToday = (updateOps.$inc.sectionsMasteredToday || 0) + 1;

                updateOps.$set[`enrolledJourneys.${jIndex}.currentSectionId`] = nxt;
                updateOps.$set[`enrolledJourneys.${jIndex}.maxSectionId`] = newMax;
                updateOps.$set[`enrolledJourneys.${jIndex}.progress`] = 0;

                // Global sync
                updateOps.$set.currentSectionId = nxt;
                updateOps.$set.progress = 0;
                updateOps.$set.currentCourse = journey.courseId;

                console.log(`[SECTION COMPLETE] User: ${user.username}, Course: ${currentCourse}, NewSection: ${nxt}`);
            }
        }
        else if (currentCourse) {
            const jIndex = findJourneyIndex(currentCourse);
            const normalized = currentCourse.toLowerCase();

            if (jIndex > -1) {
                const journey = user.enrolledJourneys[jIndex];
                const newSectionId = currentSectionId || journey.currentSectionId || 1;
                const newProgress = (progress !== undefined) ? progress : (journey.progress || 0);
                const currentMax = journey.maxSectionId || journey.currentSectionId || 1;
                const newMax = Math.max(currentMax, newSectionId);

                updateOps.$set.currentCourse = journey.courseId;
                updateOps.$set.currentSectionId = newSectionId;
                updateOps.$set.progress = newProgress;

                updateOps.$set[`enrolledJourneys.${jIndex}.currentSectionId`] = newSectionId;
                updateOps.$set[`enrolledJourneys.${jIndex}.progress`] = newProgress;
                updateOps.$set[`enrolledJourneys.${jIndex}.maxSectionId`] = newMax;
            } else {
                updateOps.$push = {
                    enrolledJourneys: { courseId: normalized, currentSectionId: 1, maxSectionId: 1, progress: 0 }
                };
                updateOps.$set.currentCourse = normalized;
                updateOps.$set.currentSectionId = 1;
                updateOps.$set.progress = 0;
            }
        }

        // Additional XP Logic
        if (xpIncrement) {
            updateOps.$inc.xp = (updateOps.$inc.xp || 0) + xpIncrement;
            updateOps.$inc.xpToday = (updateOps.$inc.xpToday || 0) + xpIncrement;
            updateOps.$inc.exercisesCompletedToday = 1;
        }
        if (isFirstTry) {
            updateOps.$inc.firstTrySolves = 1;
            updateOps.$inc.xp = (updateOps.$inc.xp || 0) + 10;
            updateOps.$inc.xpToday = (updateOps.$inc.xpToday || 0) + 10;
        }

        if (updateOps.$inc && Object.keys(updateOps.$inc).length === 0) delete updateOps.$inc;

        // Perform main update
        let updatedUser = await User.findByIdAndUpdate(userId, updateOps, { new: true }).select('-password');
        console.log(`[PROGRESS] Start -> User: ${updatedUser.username}, Course: ${currentCourse}, XP: ${updatedUser.xp}, Journeys: ${updatedUser.enrolledJourneys?.length || 0}`);

        // FORCE RESYNC: Check for NEW titles and ensure list is mapped correctly
        const currentUnlocked = updatedUser.unlockedTitles || [];
        const mappedUnlocked = currentUnlocked.map(t => TITLE_MAPPING[t] || t);
        const eligibleTitles = getEligibleTitles(updatedUser);
        const freshTitles = [...new Set([...mappedUnlocked, ...eligibleTitles])];

        if (freshTitles.length !== currentUnlocked.length || JSON.stringify(freshTitles) !== JSON.stringify(currentUnlocked)) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { unlockedTitles: freshTitles } },
                { new: true }
            ).select('-password');
            console.log(`   [TITLES UPDATED] Count: ${freshTitles.length}`);
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("[PROGRESS ERROR]", err.message);
        res.status(500).send('Server Error');
    }
});

// UPDATE USER SETTINGS
router.put('/settings', auth, async (req, res) => {
    try {
        const {
            username, email, major, year,
            skillsToLearn, skillsToTeach,
            onboardingGoal, onboardingLevel,
            onboardingCommitment, onboardingLanguage,
            bio, socialLinks, dob, isPrivate, selectedTitle
        } = req.body;
        const userFields = {};
        if (username !== undefined) userFields.username = username;
        if (email !== undefined) userFields.email = email;
        if (major !== undefined) userFields.major = major;
        if (year !== undefined) userFields.year = year;
        if (skillsToLearn !== undefined) userFields.skillsToLearn = skillsToLearn;
        if (skillsToTeach !== undefined) userFields.skillsToTeach = skillsToTeach;
        if (onboardingGoal !== undefined) userFields.onboardingGoal = onboardingGoal;
        if (onboardingLevel !== undefined) userFields.onboardingLevel = onboardingLevel;
        if (onboardingCommitment !== undefined) userFields.onboardingCommitment = onboardingCommitment;
        if (onboardingLanguage !== undefined) userFields.onboardingLanguage = onboardingLanguage;
        if (bio !== undefined) userFields.bio = bio;
        if (socialLinks !== undefined) userFields.socialLinks = socialLinks;
        if (dob !== undefined) userFields.dob = dob;
        if (isPrivate !== undefined) userFields.isPrivate = isPrivate;

        // Ensure selectedTitle mapping
        if (selectedTitle !== undefined) {
            userFields.selectedTitle = TITLE_MAPPING[selectedTitle] || selectedTitle;
        }

        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('[SETTINGS ERROR]', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;