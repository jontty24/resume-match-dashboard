import { useState } from "react";
import InputPanel from "./components/InputPanel";
import ScoreCard from "./components/ScoreCard";
import SkillsCard from "./components/SkillsCard";
import SuggestionsCard from "./components/SuggestionsCard";
import type { AnalysisResult } from "./types/analysis";
import { analyzeResumeMatch } from "./services/mockAnalyzer";
import KeywordTable from "./components/KeywordTable";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!resumeText.trim()) {
      setError("Resume text is required.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const analysis = analyzeResumeMatch(resumeText, jobDescription);
      setResult(analysis);
    } catch {
      setError("Something went wrong during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Resume Match Dashboard
        </h1>
        <p className="mb-6 text-slate-600">
          Compare your resume against a job description and identify gaps.
        </p>

        <InputPanel
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-6 rounded-xl bg-white p-5 shadow">
            <p className="text-lg font-semibold text-slate-700">Analyzing resume match...</p>
          </div>
        )}

        {result && !loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ScoreCard score={result.score} />
            <SkillsCard title="Matching Skills" items={result.matchingSkills} />
            <SkillsCard title="Missing Skills" items={result.missingSkills} />
            <SkillsCard title="Strengths" items={result.strengths} />
            <SuggestionsCard suggestions={result.suggestions} />
            <KeywordTable items={result.keywordCoverage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;