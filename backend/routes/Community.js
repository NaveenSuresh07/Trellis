const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User'); // Required for .populate()
const { PDFParse } = require('pdf-parse');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// GET /api/community - Fetch all verified posts (filterable by course)
router.get('/', async (req, res) => {
    try {
        const { courseId } = req.query;
        const query = { isVerified: true };
        if (courseId) query.courseId = courseId.toLowerCase();

        const posts = await Post.find(query)
            .populate('user', 'username selectedTitle')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST /api/community - Upload and Moderate Post
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const { courseId, caption } = req.body;
        if (!courseId) return res.status(400).json({ msg: 'Course ID is required' });

        const fileType = req.file.mimetype.startsWith('image/') ? 'image'
            : req.file.mimetype === 'application/pdf' ? 'pdf'
                : req.file.mimetype.startsWith('video/') ? 'video'
                    : null;

        if (!fileType) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ msg: 'Invalid file type. Only JPG, PDF, and MP4 are supported.' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        // Create initial post (Not verified yet)
        const newPost = new Post({
            user: req.user.id,
            courseId,
            caption,
            fileUrl,
            fileType,
            mimeType: req.file.mimetype,
            originalname: req.file.originalname,
            isVerified: false
        });

        // AI MODERATION
        let verificationResult = { allowed: true, reason: 'Pending Review' };

        try {
            console.log(`[AI MODERATION] Analyzing content for course: ${courseId}`);
            const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

            // Refined Prompt for Better Educational Support (VERY LENIENT)
            const prompt = `
                You are a senior content moderator for Trellis.
                Course: ${courseId}
                Post Caption: "${caption || 'No caption'}"
                File: ${req.file.originalname}
                
                Logic:
                1. ALLOW everything educational, coding questions, study notes, or helpful tips.
                2. REJECT only harmful content: scams, spam links, malware, or offensive materials.
                3. If unsure, ALWAYS allow (true).
                
                Respond in JSON: {"allowed": true, "reason": "educational content"}
            `;

            const response = await axios.post(GEMINI_URL, {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: "application/json",
                    temperature: 0.1
                }
            }, { timeout: 10000 });

            if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                const rawText = response.data.candidates[0].content.parts[0].text;
                const jsonStr = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
                verificationResult = JSON.parse(jsonStr);
                console.log(`[AI MODERATION RESULT] Allowed: ${verificationResult.allowed}, Reason: ${verificationResult.reason}`);
            }
        } catch (apiErr) {
            console.error('Moderation API Error (Bypassing to Allow):', apiErr.message);
            // Default to allowed if AI is down or errors, to prevent blocking users
            verificationResult = { allowed: true, reason: 'AI Check Bypassed (System Stability)' };
        }

        if (verificationResult.allowed) {
            newPost.isVerified = true;
            newPost.moderationNote = verificationResult.reason;
            await newPost.save();
            res.json(newPost);
        } else {
            // Delete the file if it's unwanted
            fs.unlinkSync(req.file.path);
            res.status(403).json({ msg: 'Post rejected: ' + (verificationResult.reason || 'Content unrelated to course work.') });
        }

    } catch (err) {
        console.error(err);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).send('Server Error');
    }
});

// PUT /api/community/like/:id - Toggle Like on Post
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Check if already liked
        const likeIndex = post.likes.indexOf(req.user.id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST /api/community/comment/:id - Add comment to Post
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const newComment = {
            user: req.user.id,
            username: user.username,
            text: req.body.text
        };

        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
