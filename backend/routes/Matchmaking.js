const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

const CORE_LANGUAGES = ['JavaScript', 'HTML', 'C', 'Python'];

// @route   POST api/matchmaking/skills
// @desc    Update user skills
// @access  Private
router.post('/skills', auth, async (req, res) => {
    const { skillsToTeach, skillsToLearn } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Normalize and Validate skills against core languages (Case-Insensitive check, but preserve display)
        const normalize = (list) => (list || []).map(s => {
            const found = CORE_LANGUAGES.find(core => core.toLowerCase() === s.toLowerCase());
            return found || null;
        }).filter(Boolean);

        user.skillsToTeach = [...new Set(normalize(skillsToTeach))];
        user.skillsToLearn = [...new Set(normalize(skillsToLearn))];

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/matchmaking/peers
// @desc    Find students to learn from and teach to
// @access  Private
router.get('/peers', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ msg: 'User not found' });

        // LOGIC: Find users where User A's "Needs" intersect with Peer's "Expertise"
        // ( Peer.skillsToTeach includes CurrentUser.skillsToLearn )
        const peers = await User.find({
            _id: { $ne: req.user.id }, // Exclude self
            skillsToTeach: { $in: currentUser.skillsToLearn || [] }
        }).select('username email major skillsToTeach skillsToLearn xp streak selectedTitle');

        const scoredPeers = peers.map(peer => {
            const canTeachMe = (peer.skillsToTeach || []).filter(s => (currentUser.skillsToLearn || []).includes(s));
            const iCanTeachThem = (peer.skillsToLearn || []).filter(s => (currentUser.skillsToTeach || []).includes(s));

            // A "Perfect Match" is when they teach what I need AND I teach what they need
            const isPerfectMatch = canTeachMe.length > 0 && iCanTeachThem.length > 0;

            return {
                ...peer._doc,
                matchScore: canTeachMe.length,
                isPerfectMatch,
                overlapLearn: canTeachMe,
                overlapTeach: iCanTeachThem
            };
        }).sort((a, b) => {
            // Perfect matches first, then by match score (how much they can teach me)
            if (a.isPerfectMatch !== b.isPerfectMatch) return b.isPerfectMatch ? 1 : -1;
            return b.matchScore - a.matchScore;
        });

        res.json(scoredPeers);
    } catch (err) {
        console.error("Matchmaking Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
