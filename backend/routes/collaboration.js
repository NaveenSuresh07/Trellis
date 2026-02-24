const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Collaboration = require('../models/Collaboration');
const User = require('../models/User');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

console.log(`[UPLOAD CONFIG] CWD: ${process.cwd()}`);
console.log(`[UPLOAD CONFIG] Absolute Upload Dir: ${uploadDir}`);

// Multer Storage Configuration (Matches Community.js logic)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `nexus-${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// @route   GET api/collaboration/:peerId
// @desc    Get or create collaboration session with a peer
// @access  Private
router.get('/:peerId', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const peerId = req.params.peerId;

        // Find collaboration where both IDs are in the participants array
        let collaboration = await Collaboration.findOne({
            participants: { $all: [userId, peerId] }
        });

        if (!collaboration) {
            collaboration = new Collaboration({
                participants: [userId, peerId],
                messages: [],
                notes: []
            });
            await collaboration.save();
        }

        // Populate participant names for UI
        const populated = await collaboration.populate('participants', 'username selectedTitle');
        res.json(populated);
    } catch (err) {
        console.error("Collaboration Fetch Error:", err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/collaboration/:peerId/message
// @desc    Send a message to a peer
// @access  Private
router.post('/:peerId/message', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Message text required' });

    try {
        const userId = req.user.id;
        const peerId = req.params.peerId;

        const collaboration = await Collaboration.findOne({
            participants: { $all: [userId, peerId] }
        });

        if (!collaboration) return res.status(404).json({ msg: 'Collaboration session not found' });

        collaboration.messages.push({
            senderId: userId,
            text
        });
        collaboration.lastUpdated = Date.now();
        await collaboration.save();

        res.json(collaboration.messages[collaboration.messages.length - 1]);
    } catch (err) {
        console.error("Message Send Error:", err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/collaboration/:peerId/upload
// @desc    Upload a file to a peer collaboration
// @access  Private
router.post('/:peerId/upload', auth, (req, res, next) => {
    console.log(`[ROUTE TRACE] Incoming upload for peer: ${req.params.peerId}`);
    next();
}, upload.single('file'), async (req, res) => {
    try {
        console.log(`[UPLOAD DEBUG] User: ${req.user.id}, Peer: ${req.params.peerId}`);
        console.log(`[UPLOAD DEBUG] File:`, req.file ? req.file.originalname : 'MISSING');

        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const userId = req.user.id;
        const peerId = req.params.peerId;

        const collaboration = await Collaboration.findOne({
            participants: { $all: [userId, peerId] }
        });

        if (!collaboration) {
            if (req.file.path) fs.unlinkSync(req.file.path);
            return res.status(404).json({ msg: 'Collaboration session not found' });
        }

        const fileType = req.file.mimetype.startsWith('image/') ? 'image'
            : req.file.mimetype === 'application/pdf' ? 'pdf'
                : req.file.mimetype.startsWith('video/') ? 'video'
                    : null;

        if (!fileType) {
            if (req.file.path) fs.unlinkSync(req.file.path);
            return res.status(400).json({ msg: 'Invalid file type. Support: JPG, PDF, MP4' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        collaboration.messages.push({
            senderId: userId,
            text: req.body.text || '', // Optional caption
            fileUrl,
            fileType
        });

        collaboration.lastUpdated = Date.now();
        await collaboration.save();

        res.json(collaboration.messages[collaboration.messages.length - 1]);
    } catch (err) {
        console.error("File Upload Error:", err);
        if (req.file && req.file.path) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        res.status(500).json({ msg: 'Server Error', details: err.message });
    }
});

// @route   POST api/collaboration/:peerId/note
// @desc    Add or update a note in the workspace
// @access  Private
router.post('/:peerId/note', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Note text required' });

    try {
        const userId = req.user.id;
        const peerId = req.params.peerId;

        const collaboration = await Collaboration.findOne({
            participants: { $all: [userId, peerId] }
        });

        if (!collaboration) return res.status(404).json({ msg: 'Collaboration session not found' });

        collaboration.notes.push({
            authorId: userId,
            text
        });
        collaboration.lastUpdated = Date.now();
        await collaboration.save();

        res.json(collaboration.notes[collaboration.notes.length - 1]);
    } catch (err) {
        console.error("Note Save Error:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
