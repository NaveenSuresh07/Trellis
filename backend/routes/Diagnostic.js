const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.get('/test-ai', async (req, res) => {
    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!apiKey) return res.json({ status: 'error', message: 'API Key missing' });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Hi");
        const response = await result.response;

        res.json({ status: 'success', reply: response.text() });
    } catch (err) {
        res.json({
            status: 'error',
            message: err.message,
            stack: err.stack,
            apiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) : 'none'
        });
    }
});

module.exports = router;
