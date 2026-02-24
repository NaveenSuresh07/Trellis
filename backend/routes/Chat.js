const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        console.log('Action: Calling Gemini 2.5 API (Chat/Axios)...');

        // Using v1beta and gemini-2.5-flash which were verified as working via axios
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const contents = [];

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

        // Add the current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await axios.post(GEMINI_URL, {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
            },
            // Note: System instructions in v1beta/axios are sometimes tricky, 
            // we'll keep it simple for now to ensure connectivity.
            systemInstruction: {
                parts: [{ text: "You are YIP, the friendly mascot of the Trellis study platform. Keep your answers brief, helpful, and encouraging. Focus on study tips, explaining concepts simply, and platform support." }]
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
