const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./.env" });

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).map(m => m.name);
        console.log("Available generateContent models:\n", models.join("\n"));
    } catch (e) {
        console.error(e);
    }
}
listModels();
