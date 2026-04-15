const { GoogleGenAI } = require("@google/genai");
const { GEMINI_API_KEY, GROQ_API_KEY } = require("../utils/dotenv.js");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: GROQ_API_KEY });

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

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

module.exports = generateInterviewReport;
