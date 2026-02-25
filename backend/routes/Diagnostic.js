const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/test-ai', async (req, res) => {
    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!apiKey) return res.json({ status: 'error', message: 'API Key missing' });

        // Hit the raw API to list models and see what this key can actually do
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url);

        res.json({
            status: 'success',
            models: response.data.models.map(m => m.name)
        });
    } catch (err) {
        res.json({
            status: 'error',
            message: err.response?.data || err.message,
            apiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) : 'none'
        });
    }
});

module.exports = router;
