import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "Both resumeText and jobDescription are required.",
      });
    }

    const prompt = `
You are an expert resume evaluator.

Compare the candidate's resume against the job description and return ONLY valid JSON in this exact structure:

{
  "score": number,
  "matchingSkills": ["string"],
  "missingSkills": ["string"],
  "strengths": ["string"],
  "suggestions": ["string"],
  "keywordCoverage": [
    {
      "keyword": "string",
      "found": true
    }
  ]
}

Rules:
- score must be between 0 and 100
- matchingSkills should contain relevant strengths aligned to the job
- missingSkills should contain important gaps
- strengths should be concise
- suggestions should be actionable
- keywordCoverage should reflect important keywords from the job description and whether they are present in the resume
- return JSON only, no markdown, no explanation

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: content,
      });
    }

    return res.status(200).json(parsed);
  } catch (error: any) {
    return res.status(500).json({
      error: "Server error during analysis",
      details: error?.message || "Unknown error",
    });
  }
}