type ScoreCardProps = {
  score: number;
};

function ScoreCard({ score }: ScoreCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h3 className="mb-2 text-lg font-semibold">Match Score</h3>
      <p className="text-4xl font-bold text-blue-600">{score}%</p>
    </div>
  );
}

export default ScoreCard;