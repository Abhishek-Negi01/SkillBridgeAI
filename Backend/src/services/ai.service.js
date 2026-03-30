const { GoogleGenAI } = require("@google/genai");
const { GEMINI_API_KEY } = require("../utils/dotenv.js");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job descrption.",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical questions which can be asked in the interview.",
          ),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking this question.",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .description(
      "Technical questions that can be asked in the interview along with their intention and how to answer them.",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral questions which can be asked in the interview.",
          ),
        intention: z
          .string()
          .describe(
            "The intention of interviewer behind asking this question.",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .description(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking."),
        severity: z
          .enum(["low", "medium", "hard"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances.",
          ),
      }),
    )
    .description(
      "List of skill gaps in the candidate's profile along with their severity.",
    ),
  preprationPlan: z.array(
    z
      .object({
        day: z
          .number()
          .describe(
            "The number of days in the prepration plan, starting from 1.",
          ),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the prepration plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z.array(
          z
            .string()
            .describe(
              "List of tasks to be done on this day to follow the prepration plan, e.g. read a specific book, article or research paper, solve a set of problems, watch a video etc.",
            ),
        ),
      })
      .describe(
        "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
      ),
  ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate with the following details:
  Resume : ${resume} 
  Self Description : ${selfDescription}
  Job Description : ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  // console.log(JSON.parse(response.text));
  return JSON.parse(response.text);
}

module.exports = generateInterviewReport;
