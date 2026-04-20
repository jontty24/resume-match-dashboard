type SuggestionsCardProps = {
  suggestions: string[];
};

function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow md:col-span-2">
      <h3 className="mb-2 text-lg font-semibold">Suggestions</h3>
      <ul className="list-inside list-disc text-slate-700">
        {suggestions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionsCard;