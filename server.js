import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image uploaded.');
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("API Key is missing in .env");
      return res.status(500).json({ error: "API Key is missing in .env" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("Sending request to Gemini API...");
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = "Identify the clothing items in this photo. Provide a list with a short description for each item. Format the output as a JSON array of objects with 'id', 'name', 'brand' (guess if unknown), 'price' (estimate in RUB), and 'link' (use a generic placeholder like 'https://www.google.com/search?q=' + item name).";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini.");

    // Attempt to parse JSON from response
    let clothingResults;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        clothingResults = JSON.parse(jsonMatch[0]);
      } else {
        clothingResults = [{ id: 1, name: text, brand: 'AI Analysis', price: '-', link: '#' }];
      }
    } catch (e) {
      console.error("JSON Parse Error:", e);
      clothingResults = [{ id: 1, name: text, brand: 'AI Analysis', price: '-', link: '#' }];
    }

    res.json(clothingResults);
  } catch (error) {
    console.error("FULL Gemini API Error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
