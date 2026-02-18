import useEditUnitBasedPayable from "./useEditUnitBasedPayable";
import BackButton from "../../../../../components/Button/BackButton";
import FormInput from "../../../../../components/Form/FormInput";
import FormSelect from "../../../../../components/Form/FormSelect";
import FormTextarea from "../../../../../components/Form/TextArea";

const EditUnitBasedPayablePage = () => {
  const {
    projectId,
    form,
    errors,
    serverError,
    success,
    jobs,
    units,
    currencies,
    files,
    prices,
    selectedPriceId,
    projectMeta,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-180px)]">

        {/* LEFT COLUMN */}
        <form className="bg-white shadow rounded-lg p-8 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-8">
              <BackButton to={`/project/${projectId}?tab=finances`} />
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Unit Based Payable
              </h1>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Project Client
                </p>
                <p className="text-gray-900 font-medium">
                  {projectMeta.client_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Project Specialization
                </p>
                <p className="text-gray-900 font-medium">
                  {projectMeta.specialization_name || "—"}
                </p>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            <FormSelect
              label="Job"
              name="job_id"
              value={form.job_id}
              onChange={handleChange}
              onBlur={handleBlur}
              options={jobs.map((j) => ({ value: j.id, label: j.job_name }))}
              error={errors.job_id}
              required
            />

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
                label: `${c.currency?.code || "?"} (${c.currency?.symbol || "?"})`,
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
                label: f.original_file_name || f.file_name,
              }))}
              disabled={!form.job_id}
            />

            <FormTextarea
              label="Note for Vendor"
              name="note_for_vendor"
              value={form.note_for_vendor}
              onChange={handleChange}
              rows={3}
            />

            <FormTextarea
              label="Internal Note"
              name="internal_note"
              value={form.internal_note}
              onChange={handleChange}
              rows={3}
            />

            <span className="text-gray-500 text-sm mt-1">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-5">
            Relevant Prices
          </h1>

          <p className="text-sm text-gray-500 mb-3">
            Click a row to copy data to form. Matched prices are highlighted in green.
          </p>

          {prices.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No relevant prices found
            </div>
          ) : (
            <div className="border rounded-lg overflow-auto max-h-[520px]">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    {["Vendor", "Service", "Language Pair", "Unit", "Price per Unit", "Currency", "Note"].map((h) => (
                      <th key={h} className="px-3 py-2 text-center font-semibold text-gray-700">
                        {h}
                      </th>
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
                        <td className="px-3 py-2">{row.vendor?.company_name || "—"}</td>
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