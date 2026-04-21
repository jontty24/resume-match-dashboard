import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
    });
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "Both resumeText and jobDescription are required.",
      });
    }

    const prompt = `
You are an expert resume evaluator, technical recruiter, and career coach.

Your task is to compare a candidate's resume against a job description and return a structured evaluation.

You must evaluate:
1. Overall alignment between the resume and the job description
2. Relevant matching technical and professional skills
3. Important missing skills or gaps
4. Key strengths of the candidate for this role
5. Practical suggestions to improve resume alignment
6. Keyword coverage for important job-related terms

SCORING RULES:
- Score must be an integer from 0 to 100
- 90-100 = exceptionally strong match
- 75-89 = strong match
- 60-74 = moderate match
- 40-59 = weak match
- 0-39 = poor match
- Do not inflate the score without evidence from the resume

SCORING LOGIC (STRICT):

Evaluate based on weighted importance:

- Core Skill Match (50% weight):
  Does the resume match the primary domain? (e.g., frontend vs full stack)
  
- Secondary Skills (30% weight):
  Tools like Node.js, AWS, TypeScript
  
- Experience & Context (20% weight):
  APIs, Agile, real-world usage

Rules:
- Strong match in core skills MUST result in at least 60+
- Missing secondary tools should NOT drop score below 55 if core skills match well
- Only give scores below 50 if there is weak or no domain relevance
- Do not over-penalize missing tools if the candidate clearly fits part of the role

Examples:
- Frontend dev vs full stack → 60–75
- Strong full stack match → 85–100
- Completely unrelated → 0–30

Guidelines:
- If 50–70% of requirements are met → score should be between 60–75
- If only basic or indirect relevance → 30–50
- If strong alignment with most requirements → 80+

Do NOT penalize too harshly for missing tools if core skills are present.
Do NOT give low scores when there is clear partial alignment.

MATCHING RULES:
- matchingSkills should include only skills, tools, or concepts clearly supported by the resume and relevant to the job
- missingSkills should include important requirements from the job description that are missing or weakly represented in the resume
- strengths should be concise, professional, and specific to this role
- suggestions should be practical, resume-focused, and actionable
- keywordCoverage should include important keywords from the job description and whether they are represented in the resume
- Do not invent experience, qualifications, or achievements not present in the resume
- Be fair, accurate, and conservative when evidence is weak
- Prefer professional recruiting language over generic wording
- Avoid repeating the same idea across strengths, suggestions, and matchingSkills
- Consider role proximity (e.g., frontend developer vs full-stack = moderate match, not poor)
- If the candidate clearly matches one major part of the role, do not score below 60

OUTPUT RULES:
- Return ONLY valid JSON
- Do not include markdown
- Do not include explanations outside JSON
- Do not include trailing commas
- Follow this exact structure:

{
  "score": 0,
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

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
            role: "system",
            content:
            "You are a strict professional resume evaluator. You must return only valid JSON with no extra text.",
        },
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
      const match = content.match(/\{[\s\S]*\}/);

      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          return res.status(500).json({
            error: "Invalid JSON from AI",
            raw: content,
          });
        }
      } else {
        return res.status(500).json({
          error: "No JSON found in AI response",
          raw: content,
        });
      }
    }

    return res.status(200).json(parsed);
  } catch (error: any) {
    return res.status(500).json({
      error: "Server error",
      details: error?.message || "Unknown error",
    });
  }
}