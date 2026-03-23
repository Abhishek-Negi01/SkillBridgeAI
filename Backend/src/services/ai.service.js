const { GoogleGenAI } = require("@google/genai");
const { GEMINI_API_KEY } = require("../utils/dotenv.js");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
