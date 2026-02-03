const LinkedInputFilesCard = ({ files = [], onUpdate, onDownloadZip }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800">
          Linked input files
        </h3>

        <div className="flex gap-2">
          <button
            onClick={onUpdate}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Update
          </button>

          <button
            onClick={onDownloadZip}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Download as zip
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white shadow rounded-lg overflow-hidden">
        <div className="max-h-[360px] overflow-y-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 text-black-600 text-[11px] tracking-widest border-b">
                {[
                  "File #",
                  "Filename",
                  "Size",
                  "Category",
                  "Note",
                  "Uploaded at",
                  "Uploaded by",
                  "Output from job",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-center font-bold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-gray-500 text-xs"
                  >
                    No input files linked.
                  </td>
                </tr>
              ) : (
                files.map((file, index) => (
                  <tr
                    key={file.id || index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "hover:bg-gray-100"
                    }
                  >
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {index + 1}
                    </td>

                    <td className="px-3 py-2 text-xs text-blue-600 cursor-pointer break-words">
                      {file.filename || "—"}
                    </td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {file.size || "—"}
                    </td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {file.category || "—"}
                    </td>

                    <td className="px-3 py-2 text-xs break-words text-gray-600">
                      {file.note || "—"}
                    </td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {file.uploaded_at || "—"}
                    </td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {file.uploaded_by || "—"}
                    </td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {file.output_from_job ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LinkedInputFilesCard;