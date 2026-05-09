import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  try {
    console.log("Fetching models list from Google API...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    if (data.error) {
       console.error("API Error:", data.error);
    } else {
       console.log("Available Models:");
       data.models.forEach(m => console.log(`- ${m.name}`));
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModels();
