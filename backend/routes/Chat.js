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
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // 1. Start with System Context (User) and Acknowledgement (Model)
        const contents = [
            { role: 'user', parts: [{ text: "You are YIP, the friendly mascot of the Trellis study platform. Keep your answers brief, helpful, and encouraging." }] },
            { role: 'model', parts: [{ text: "I am YIP! Ready to help you crush your study goals." }] }
        ];

        // 2. Process history ensuring strict alternation (User -> Model -> User...)
        if (history && Array.isArray(history)) {
            const cleanHistory = history.filter(msg =>
                msg.content &&
                !msg.content.includes("brain freeze") &&
                !msg.content.includes("trouble connecting") &&
                msg.content !== "Hi! I'm YIP. Ready to crush some study goals today? How can I help?" // Skip greeting
            );

            let lastRole = 'model'; // The starter pair ends with model

            cleanHistory.slice(-6).forEach(msg => {
                const currentRole = (msg.role === 'user' || msg.role === 'user') ? 'user' : 'model';

                // Only add if it alternates
                if (currentRole !== lastRole) {
                    contents.push({
                        role: currentRole,
                        parts: [{ text: msg.content }]
                    });
                    lastRole = currentRole;
                }
            });

            // 3. Ensure the NEXT added message (current user input) follows a MODEL role
            if (lastRole === 'user') {
                contents.push({
                    role: 'model',
                    parts: [{ text: "I see. Go on." }]
                });
            }
        }

        // 4. Current user message (Must follow Model)
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        console.log(`[AI DEBUG] Sending ${contents.length} messages...`);

        const response = await axios.post(GEMINI_URL, {
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 20000
        });

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const reply = response.data.candidates[0].content.parts[0].text;
            console.log('--- AI SUCCESS ---');
            return res.json({ reply });
        } else {
            throw new Error('Empty Gemini response');
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
