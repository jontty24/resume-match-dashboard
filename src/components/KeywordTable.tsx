type KeywordCoverageItem = {
  keyword: string;
  found: boolean;
};

type KeywordTableProps = {
  items: KeywordCoverageItem[];
};

function KeywordTable({ items }: KeywordTableProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow md:col-span-2">
      <h3 className="mb-4 text-lg font-semibold">Keyword Coverage</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-200 px-4 py-2 text-left">Keyword</th>
              <th className="border border-slate-200 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.keyword}>
                <td className="border border-slate-200 px-4 py-2 capitalize">
                  {item.keyword}
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  <span
                    className={`rounded px-2 py-1 text-sm font-medium ${
                      item.found
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.found ? "Found" : "Missing"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KeywordTable;