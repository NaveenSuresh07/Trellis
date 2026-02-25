require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // There isn't a direct listModels in the simple genAI object usually, 
        // you often have to use a specific model or just know the names.
        // But let's try the simplest one:
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("Gemini-pro works!");
    } catch (e) {
        console.log("Gemini-pro failed: " + e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash-latest works!");
    } catch (e) {
        console.log("gemini-1.5-flash-latest failed: " + e.message);
    }
}
listModels();
