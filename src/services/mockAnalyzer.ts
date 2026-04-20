import type { AnalysisResult } from "../types/analysis";

const skillMap: Record<string, string[]> = {
  react: ["react"],
  typescript: ["typescript"],
  javascript: ["javascript"],
  html: ["html"],
  css: ["css"],
  tailwind: ["tailwind", "tailwind css"],
  redux: ["redux"],
  node: ["node", "node.js"],
  express: ["express"],
  python: ["python"],
  flask: ["flask"],
  sql: ["sql"],
  sqlite: ["sqlite"],
  aws: ["aws", "amazon web services"],
  docker: ["docker"],
  git: ["git", "github"],
  "github actions": ["github actions"],
  "ci/cd": ["ci/cd", "cicd", "pipeline", "pipelines", "continuous integration", "continuous deployment"],
  "rest api": ["rest api", "rest apis", "api integration", "api integrations"],
  testing: ["testing", "jest", "unit testing", "test automation"],
  agile: ["agile", "scrum"],
};

function normalize(text: string) {
  return text.toLowerCase();
}

function matchesAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern));
}

export function analyzeResumeMatch(
  resumeText: string,
  jobDescription: string
): AnalysisResult {
  const resume = normalize(resumeText);
  const jd = normalize(jobDescription);

  const requiredSkills = Object.entries(skillMap)
    .filter(([, aliases]) => matchesAny(jd, aliases))
    .map(([skill]) => skill);

  const matchingSkills = requiredSkills.filter((skill) =>
    matchesAny(resume, skillMap[skill])
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !matchesAny(resume, skillMap[skill])
  );

  const keywordCoverage = requiredSkills.map((skill) => ({
    keyword: skill,
    found: matchesAny(resume, skillMap[skill]),
  }));

  const score =
    requiredSkills.length === 0
      ? 0
      : Math.round((matchingSkills.length / requiredSkills.length) * 100);

  const strengths =
    matchingSkills.length > 0
      ? [
          `Matched ${matchingSkills.length} relevant skill(s) from the job description.`,
          "Resume shows alignment with required technical keywords.",
          "Good foundation for targeted resume optimization.",
        ]
      : [
          "Resume has limited overlap with the detected job requirements.",
          "Technical alignment appears weak based on keyword comparison.",
        ];

  const suggestions = [
    ...(missingSkills.length
      ? [`Add or strengthen evidence for: ${missingSkills.join(", ")}.`]
      : ["Your resume covers most detected keywords well."]),
    "Tailor resume bullets to reflect project outcomes and business impact.",
    "Use job-specific terminology where it accurately matches your experience.",
  ];

  return {
    score,
    matchingSkills,
    missingSkills,
    strengths,
    suggestions,
    keywordCoverage,
  };
}