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

        // Create a compliant message list with alternating roles
        // Rule: Must start with User, and alternate User -> Model -> User...
        const contents = [];

        // 1. Initial User Context (System Instruction)
        contents.push({
            role: 'user',
            parts: [{ text: "You are YIP, the friendly mascot of the Trellis study platform. Keep your answers brief, helpful, and encouraging. Focus on study tips, concepts, and support." }]
        });

        // 2. Initial Model Acknowledgement
        contents.push({
            role: 'model',
            parts: [{ text: "I am YIP! Ready to help you crush your study goals." }]
        });

        // 3. Process History (Ensure it alternates after our starter pair)
        if (history && Array.isArray(history)) {
            // Filter out errors and placeholders
            const cleanHistory = history.filter(msg =>
                msg.content &&
                !msg.content.includes("brain freeze") &&
                !msg.content.includes("trouble connecting")
            );

            // We need the next role to be 'user' to follow the starter pair
            let expectedRole = 'user';

            cleanHistory.slice(-8).forEach(msg => {
                const role = msg.role === 'user' ? 'user' : 'model';
                if (role === expectedRole) {
                    contents.push({
                        role: role,
                        parts: [{ text: msg.content }]
                    });
                    // Toggle expected role
                    expectedRole = expectedRole === 'user' ? 'model' : 'user';
                }
            });

            // If the last history message was a model response, the current user message will naturally be next.
            // If the last was user, we might need a dummy model acknowledgement if Gemini is strict,
            // but usually it's better to just ensure the FINAL message is user.
            if (expectedRole === 'user') {
                // Continue naturally
            } else {
                // Last was user, add a placeholder model reply so the current message is valid
                contents.push({
                    role: 'model',
                    parts: [{ text: "I'm listening." }]
                });
            }
        }

        // 4. Final Current User Message (Must be User)
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        console.log(`[AI DEBUG] Sending ${contents.length} messages to Gemini...`);

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
            console.log('--- AI SUCCESS ---');
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
