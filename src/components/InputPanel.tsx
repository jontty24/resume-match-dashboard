type InputPanelProps = {
  resumeText: string;
  setResumeText: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
};

function InputPanel({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  onAnalyze,
  loading,
  onFileUpload,
  fileName,
}: InputPanelProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Resume Input
          </h2>
          <label className="mb-4 inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white">
                Upload Resume (PDF)
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={onFileUpload}
                    className="hidden"
                />
                </label>
                {fileName && (
                <p className="mb-2 text-sm text-slate-500">
                    Uploaded file: {fileName}
                </p>
                )}

                {resumeText && (
                <p className="mb-4 text-sm text-green-600">
                    Resume loaded successfully
                </p>
                )}

                <textarea
                className="w-full rounded border border-slate-300 p-3"
                rows={8}
                placeholder="Paste resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                />
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Job Description
          </h2>
          <textarea
            className="w-full rounded border border-slate-300 p-3"
            rows={12}
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="mt-6 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>
    </>
  );
}

export default InputPanel;