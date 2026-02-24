const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

const CORE_LANGUAGES = ['Javascript', 'HTML', 'C', 'Python'];

// @route   POST api/matchmaking/skills
// @desc    Update user skills
// @access  Private
router.post('/skills', auth, async (req, res) => {
    const { skillsToTeach, skillsToLearn } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Validate skills against core languages
        const validTeach = (skillsToTeach || []).filter(s => CORE_LANGUAGES.includes(s));
        const validLearn = (skillsToLearn || []).filter(s => CORE_LANGUAGES.includes(s));

        user.skillsToTeach = validTeach;
        user.skillsToLearn = validLearn;

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

        // Logic: Find users who teach what I want to learn 
        // OR users who want to learn what I can teach.

        const peers = await User.find({
            _id: { $ne: req.user.id }, // Exclude self
            $or: [
                { skillsToTeach: { $in: currentUser.skillsToLearn } },
                { skillsToLearn: { $in: currentUser.skillsToTeach } }
            ]
        }).select('username email major skillsToTeach skillsToLearn xp streak selectedTitle');

        // Simple scoring: count overlaps
        const scoredPeers = peers.map(peer => {
            const canTeachMe = peer.skillsToTeach.filter(s => currentUser.skillsToLearn.includes(s));
            const iCanTeachThem = peer.skillsToLearn.filter(s => currentUser.skillsToTeach.includes(s));

            return {
                ...peer._doc,
                matchScore: canTeachMe.length + iCanTeachThem.length,
                overlapLearn: canTeachMe,
                overlapTeach: iCanTeachThem
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        res.json(scoredPeers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
