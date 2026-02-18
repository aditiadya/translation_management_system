import useEditUnitBasedPayable from "./useEditUnitBasedPayable";
import BackButton from "../../../../../components/Button/BackButton";
import FormInput from "../../../../../components/Form/FormInput";
import FormSelect from "../../../../../components/Form/FormSelect";
import FormTextarea from "../../../../../components/Form/TextArea";

const EditUnitBasedPayablePage = () => {
  const {
    form,
    errors,
    serverError,
    success,
    units,
    currencies,
    files,
    prices,
    selectedPriceId,
    meta,
    loading,
    handleChange,
    handleBlur,
    handlePriceSelect,
    submit,
    navigate,
  } = useEditUnitBasedPayable();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <BackButton to={-1} />
        <h1 className="text-2xl font-bold text-gray-900">Edit Unit Based Payable</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-180px)]">

        {/* LEFT COLUMN */}
        <form className="bg-white shadow rounded-lg p-8 overflow-y-auto">
          <div className="space-y-4">

            {/* Info Table */}
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden mb-2">
              <tbody>
                {[
                  { label: "Project",        value: `${meta.project_code} ${meta.project_name}`.trim(), highlight: true },
                  { label: "Specialization", value: meta.specialization_name },
                  { label: "Client",         value: meta.client_name, highlight: true },
                  { label: "Vendor",         value: meta.vendor_name, highlight: true },
                  { label: "Job",            value: `${meta.job_code} ${meta.job_name}`.trim(), highlight: true },
                  { label: "Service",        value: meta.service_name },
                  { label: "Language Pair",  value: meta.language_pair },
                ].map(({ label, value, highlight }) => (
                  <tr key={label} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 px-4 font-medium text-gray-600 w-40 bg-gray-50">{label}</td>
                    <td className={`py-2 px-4 ${highlight ? "text-blue-600" : "text-gray-800"}`}>
                      {value || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className="border-gray-200" />

            <FormInput
              label="Unit Amount"
              name="unit_amount"
              type="number"
              step="0.001"
              value={form.unit_amount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.unit_amount}
              required
            />

            <FormSelect
              label="Unit"
              name="unit_id"
              value={form.unit_id}
              onChange={handleChange}
              onBlur={handleBlur}
              options={units.map((u) => ({ value: u.id, label: u.name }))}
              error={errors.unit_id}
              required
            />

            <FormInput
              label="Price per Unit"
              name="price_per_unit"
              type="number"
              step="0.01"
              value={form.price_per_unit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.price_per_unit}
              required
            />

            <FormInput
              label="Subtotal"
              name="subtotal"
              value={form.subtotal}
              disabled
            />

            <FormSelect
              label="Currency"
              name="currency_id"
              value={form.currency_id}
              onChange={handleChange}
              onBlur={handleBlur}
              options={currencies.map((c) => ({
                value: c.id,
                label: `${c.currency?.code || c.code || "?"} - ${c.currency?.name || c.name || "?"}`,
              }))}
              error={errors.currency_id}
              required
            />

            <FormSelect
              label="File"
              name="file_id"
              value={form.file_id}
              onChange={handleChange}
              options={files.map((f) => ({
                value: f.id,
                label: f.linkedProjectFile?.original_file_name || f.original_file_name || f.file_name || `File #${f.id}`,
              }))}
            />

            <FormTextarea
              label="Note (hidden from vendor)"
              name="internal_note"
              value={form.internal_note}
              onChange={handleChange}
              rows={3}
            />

            <FormTextarea
              label="Note (visible to vendor)"
              name="note_for_vendor"
              value={form.note_for_vendor}
              onChange={handleChange}
              rows={3}
            />

            <span className="text-gray-500 text-sm">
              Fields marked with <span className="text-red-600">*</span> are mandatory.
            </span>

            {serverError && (
              <div className="bg-red-100 text-red-700 border border-red-400 rounded p-3 text-center font-semibold">
                {serverError}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 border border-green-400 rounded p-3 text-center font-semibold">
                {success}
              </div>
            )}
          </div>
        </form>

        {/* RIGHT COLUMN — Vendor Prices */}
        <div className="bg-white shadow rounded-lg p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Relevant Prices</h2>
          <p className="text-sm text-gray-500 mb-3">
            Click a row to copy data to form. Matched prices are highlighted in green.
          </p>

          {prices.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No relevant prices found</div>
          ) : (
            <div className="border rounded-lg overflow-auto max-h-[520px]">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    {["Vendor", "Service", "Language Pair", "Unit", "Price per Unit", "Currency", "Note"].map((h) => (
                      <th key={h} className="px-3 py-2 text-center font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prices.map((row) => {
                    const isSelected = selectedPriceId === row.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => handlePriceSelect(row)}
                        className={`cursor-pointer border-t ${
                          isSelected
                            ? "bg-green-200"
                            : row.isMatching
                            ? "bg-green-50 hover:bg-green-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-3 py-2">
                          {row.vendor?.type === "Company"
                            ? row.vendor?.company_name || "—"
                            : `${row.vendor?.primary_users?.first_name || ""} ${row.vendor?.primary_users?.last_name || ""}`.trim() || "—"}
                        </td>
                        <td className="px-3 py-2">{row.service?.name || "—"}</td>
                        <td className="px-3 py-2">
                          {row.languagePair?.sourceLanguage?.name || "?"} →{" "}
                          {row.languagePair?.targetLanguage?.name || "?"}
                        </td>
                        <td className="px-3 py-2">{row.unit || "—"}</td>
                        <td className="px-3 py-2 font-semibold">{row.price_per_unit}</td>
                        <td className="px-3 py-2">{row.currency?.currency?.code || "—"}</td>
                        <td className="px-3 py-2 truncate max-w-[150px]">{row.note || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 space-x-4">
        <button
          type="button"
          onClick={submit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditUnitBasedPayablePage;