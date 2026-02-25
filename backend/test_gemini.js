require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
        console.error('No API Key found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        console.log('Testing Gemini API with key: ' + apiKey.substring(0, 10) + '...');
        const result = await model.generateContent("Say hello!");
        const response = await result.response;
        console.log('SUCCESS: ' + response.text());
    } catch (err) {
        console.error('GEMINI TEST FAILED:');
        console.error(err.message);
        if (err.response) {
            console.error('Response Data:', err.response.data);
        }
    }
}

testGemini();
