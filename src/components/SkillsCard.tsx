type SkillsCardProps = {
  title: string;
  items: string[];
};

function SkillsCard({ title, items }: SkillsCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <ul className="list-inside list-disc text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default SkillsCard;