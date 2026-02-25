const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const officeparser = require('officeparser');
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.single('file'), async (req, res) => {
    console.log('--- SUMMARIZE REQUEST RECEIVED ---');

    try {
        let textSource = '';
        // Ensure body parameters are read correctly
        const { length = 'Medium', format = 'Paragraph', language = 'Auto' } = req.body;
        console.log(`Settings: Length=${length}, Format=${format}, Language=${language}`);

        if (req.file) {
            const { originalname, mimetype, buffer } = req.file;
            console.log(`[DEBUG] Extracting file: ${originalname}`);

            try {
                if (mimetype === 'application/pdf') {
                    const parser = new PDFParse({ data: buffer });
                    const result = await parser.getText();
                    textSource = result.text;
                    await parser.destroy();
                } else if (
                    mimetype.includes('officedocument') ||
                    mimetype.includes('presentation') ||
                    mimetype.includes('powerpoint') ||
                    mimetype.includes('msword') ||
                    originalname.match(/\.(ppt|pptx|doc|docx)$/i)
                ) {
                    textSource = await officeparser.parseOffice(buffer);
                } else {
                    return res.status(400).json({ msg: 'Unsupported file type. Use PDF, Word, or PPT.' });
                }
            } catch (extractErr) {
                console.error('EXTRACTION ERROR:', extractErr.message);
                return res.status(422).json({ msg: 'Failed to read document.' });
            }
        } else if (req.body.text) {
            textSource = req.body.text;
        } else {
            return res.status(400).json({ msg: 'No content provided.' });
        }

        const finalContent = String(textSource || '').trim();
        if (finalContent.length < 10) {
            return res.status(400).json({ msg: 'Document is too short or empty.' });
        }

        // Gemini AI Summarization via axios/v1beta
        try {
            const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
            const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            console.log(`Action: Running Gemini Summarize (gemini-1.5-flash)`);

            const formatInstruction = format === 'Bullets'
                ? 'Use ONLY bullet points for the summary.'
                : 'Use structured paragraphs for the summary.';

            const languageInstruction = language !== 'Auto'
                ? `IMPORTANT: Respond ONLY in the following language: ${language}.`
                : '';

            const prompt = `
                I want a ${length} summary of these notes.
                ${formatInstruction}
                ${languageInstruction}
                
                NOTES TO SUMMARIZE:
                ${finalContent.substring(0, 30000)}
            `;

            const response = await axios.post(GEMINI_URL, {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048
                }
            }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            });

            if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                const summaryText = response.data.candidates[0].content.parts[0].text;
                console.log('Summarize Success.');

                // Increment summariesToday for the user
                await User.findByIdAndUpdate(req.user.id, { $inc: { summariesToday: 1 } });

                return res.json({ summary: summaryText });
            } else {
                console.error('Gemini Summarize Response:', JSON.stringify(response.data));
                throw new Error('Empty Gemini response');
            }
        } catch (apiErr) {
            console.error('Gemini API Error:', apiErr.response?.data || apiErr.message);

            // Fallback
            const sentences = finalContent.split(/[.!?]+\s+/).filter(s => s.trim().length > 15);
            const count = length === 'Short' ? 3 : length === 'Medium' ? 6 : 12;
            const fallbackSummary = sentences.slice(0, count).map(s => `• ${s.trim()}`).join('\n');

            return res.json({
                summary: fallbackSummary || finalContent.substring(0, 500),
                note: 'Trellis AI is busy, showing automated points.'
            });
        }

    } catch (err) {
        console.error('FATAL SUMMARIZE ERROR:', err);
        res.status(500).json({ msg: 'Internal server error.' });
    }
});

module.exports = router;
