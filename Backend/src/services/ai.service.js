const { GROQ_API_KEY } = require("../utils/dotenv.js");
const { z } = require("zod");

const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: GROQ_API_KEY });

const puppeteer = require("puppeteer");

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
  You are an expert technical interviewer.
  
  Generate a COMPLETE interview report in STRICT JSON format.
  
  ━━━━━━━━━━━
  REQUIRED OUTPUT STRUCTURE
  ━━━━━━━━━━━
  
  {
    "matchScore": number (0–100),
  
    "technicalQuestions": [
      {
        "question": string,
        "intention": string,
        "answer": string
      }
    ],
  
    "behavioralQuestions": [
      {
        "question": string,
        "intention": string,
        "answer": string
      }
    ],
  
    "skillGaps": [
      {
        "skill": string,
        "severity": "low" | "medium" | "high"
      }
    ],
  
    "preparationPlan": [
      {
        "day": number,
        "focus": string,
        "tasks": string[]
      }
    ],
  
    "title": string
  }
  
  ━━━━━━━━━━━
  STRICT RULES
  ━━━━━━━━━━━
  
  1. ALL fields are REQUIRED
     → NEVER omit any field
     
  
  2. NO extra fields allowed
  
  3. Questions can be based on:
     - candidate’s resume
     - candidate’s projects
     - candidate’s tech stack
     - any other tech like real interview
  
  
  4. skillGaps:
     - compare resume vs job description
     - severity must be ONLY: low, medium, high
  
  5. preparationPlan:
     - must be practical and day-wise
  
  6. Return ONLY valid JSON
     - no explanation
     - no markdown
     - no text outside JSON
  
  ━━━━━━━━━━━
  INPUT DATA
  ━━━━━━━━━━━
  
  Resume:
  ${resume}
  
  Self Description:
  ${selfDescription}
  
  Job Description:
  ${jobDescription}
  `;
  const schema = {
    type: "object",
    properties: {
      matchScore: { type: "number" },
      technicalQuestions: { type: "array" },
      behavioralQuestions: { type: "array" },
      skillGaps: { type: "array" },
      preparationPlan: { type: "array" },
      title: { type: "string" },
    },
    required: [
      "matchScore",
      "technicalQuestions",
      "behavioralQuestions",
      "skillGaps",
      "preparationPlan",
      "title",
    ],
    additionalProperties: false,
  };

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "interview_report",
        strict: true,
        schema: schema,
      },
    },
  });

  const content = response?.choices?.[0]?.message?.content || response?.content;

  if (!content) {
    throw new Error("No content from Groq response");
  }

  // console.log(content);

  return JSON.parse(content);
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle2" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = {
    type: "object",
    properties: {
      html: { type: "string" },
    },
    required: ["html"],
    additionalProperties: false,
  };

  const prompt = `
You are an expert resume writer.

Generate a professional ATS-friendly resume in HTML format.

━━━━━━━━━━━
STRICT RULES
━━━━━━━━━━━

1. Return ONLY valid JSON
2. Follow schema EXACTLY
3. No extra text outside JSON

━━━━━━━━━━━
HTML RULES
━━━━━━━━━━━

- Use clean HTML (inline CSS allowed)
- Use only: div, h1, h2, p, ul, li
- No tables, no complex layouts
- Sections required:
  - Summary
  - Skills
  - Experience
  - Projects
  - Education
- Keep itin 1 page
- ATS friendly

━━━━━━━━━━━
INPUT
━━━━━━━━━━━

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume_html",
        strict: true,
        schema: resumePdfSchema,
      },
    },
  });

  const content = response?.choices?.[0]?.message?.content || response?.content;

  if (!content) {
    throw new Error("No content from Groq response");
  }

  console.log(content);

  const jsonContent = JSON.parse(content);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
