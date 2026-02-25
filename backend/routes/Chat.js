const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', auth, async (req, res) => {
    console.log('--- AI CHAT REQUEST RECEIVED ---');
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!apiKey) {
            console.error('[CHAT ERROR] GEMINI_API_KEY is missing');
            return res.json({ reply: "I'm missing my API key on this server! Check your Render environment settings." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are YIP, the friendly mascot of the Trellis study platform. Keep your answers brief, helpful, and encouraging. Focus on study tips, concepts, and support."
        });

        // Map history to SDK format
        const chatHistory = [];
        if (history && Array.isArray(history)) {
            const cleanHistory = history.filter(msg =>
                msg.content &&
                !msg.content.includes("brain freeze") &&
                !msg.content.includes("trouble connecting") &&
                msg.content !== "Hi! I'm YIP. Ready to crush some study goals today? How can I help?"
            );

            let lastRole = null;
            cleanHistory.slice(-8).forEach(msg => {
                const role = msg.role === 'user' ? 'user' : 'model';
                if (role !== lastRole) {
                    chatHistory.push({
                        role: role,
                        parts: [{ text: msg.content }]
                    });
                    lastRole = role;
                }
            });

            // If history ends with 'user', we need to close it before sending the current message
            if (lastRole === 'user') {
                chatHistory.push({
                    role: 'model',
                    parts: [{ text: "Got it, go on." }]
                });
            }
        }

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7
            }
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const reply = response.text();

        console.log('--- AI SUCCESS ---');
        return res.json({ reply });

    } catch (err) {
        console.error('CHAT API ERROR:', err.message);
        return res.json({
            reply: "I'm having a little trouble connecting to my AI brain right now. If you're on Render, make sure your GEMINI_API_KEY is correct!"
        });
    }
});

module.exports = router;
