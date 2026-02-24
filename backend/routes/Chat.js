const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    console.log('--- AI CHAT REQUEST RECEIVED ---');
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        // Create a compliant message list
        const contents = [];

        // System instruction as the FIRST message (compatible fallback)
        contents.push({
            role: 'user',
            parts: [{ text: "SYSTEM: You are YIP, the friendly mascot of the Trellis study platform. Keep your answers brief, helpful, and encouraging. Focus on study tips, explaining concepts simply, and platform support." }]
        });
        contents.push({
            role: 'model',
            parts: [{ text: "Understood! I am YIP. How can I help you today?" }]
        });

        // Filter history to remove previous error messages
        if (history && Array.isArray(history)) {
            history
                .filter(msg => msg.content && !msg.content.includes("brain freeze") && !msg.content.includes("trouble connecting"))
                .slice(-10)
                .forEach(msg => {
                    contents.push({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    });
                });
        }

        // Add the current user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await axios.post(GEMINI_URL, {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
            }
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 20000
        });

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const reply = response.data.candidates[0].content.parts[0].text;
            console.log('Chat Success.');
            return res.json({ reply });
        } else {
            console.error('Gemini Unexpected Response:', JSON.stringify(response.data));
            throw new Error('Invalid Gemini response structure');
        }

    } catch (err) {
        console.error('CHAT API ERROR:', err.response?.data || err.message);

        // Fallback message if API fails
        return res.json({
            reply: "I'm having a little trouble connecting to my AI brain right now, but I'm here! What else can I help with?"
        });
    }
});

module.exports = router;
