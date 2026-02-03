const FinanceSummaryTable = ({ data = [] }) => {
  return (
    <div className="w-full flex justify-left">
      <div className="w-full max-w-xl overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-white text-black-600 text-[11px] tracking-widest border-b">
              {["Receivables", "Payables", "Profit", "Currency", "Profit %"].map(
                (h) => (
                  <th key={h} className="px-3 py-2 text-center font-bold">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "hover:bg-gray-100"
                }
              >
                <td className="py-4 px-6 text-sm text-center text-gray-700">
                  {row.receivables}
                </td>
                <td className="py-4 px-6 text-sm text-center text-gray-700">
                  {row.payables}
                </td>
                <td className="py-4 px-6 text-sm text-center font-semibold text-green-600">
                  {row.profit}
                </td>
                <td className="py-4 px-6 text-sm text-center text-gray-700">
                  {row.currency}
                </td>
                <td className="py-4 px-6 text-sm text-center text-gray-700">
                  {row.margin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceSummaryTable;
