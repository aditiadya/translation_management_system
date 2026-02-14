import FormInput from "../../../../components/Form/FormInput";

const PaymentMethodFields = ({ formData, handleChange }) => {
  switch (formData.payment_method) {
    case "bank_transfer":
      return (
        <>
          <FormInput
            label="Payment Method Name"
            name="payment_method_name"
            value={formData.payment_method_name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Beneficiary Name"
            name="beneficiary_name"
            value={formData.beneficiary_name}
            onChange={handleChange}
          />
          <FormInput
            label="Beneficiary Address"
            name="beneficiary_address"
            value={formData.beneficiary_address}
            onChange={handleChange}
          />
          <FormInput
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Account Number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            required
          />
          <FormInput
            label="IFSC Code"
            name="ifsc_code"
            value={formData.ifsc_code}
            onChange={handleChange}
            required
          />
          <FormInput
            label="SWIFT"
            name="swift"
            value={formData.swift}
            onChange={handleChange}
            // REMOVED required
          />
          <FormInput
            label="IBAN"
            name="iban"
            value={formData.iban}
            onChange={handleChange}
            // REMOVED required
          />
          <FormInput
            label="Sort Code"
            name="sort_code"
            value={formData.sort_code}
            onChange={handleChange}
            // REMOVED required
          />
          <FormInput
            label="Bank Address"
            name="bank_address"
            value={formData.bank_address}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
          <FormInput
            label="State / Region"
            name="state_region"
            value={formData.state_region}
            onChange={handleChange}
          />
          <FormInput
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <FormInput
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </>
      );

    case "paypal":
    case "payoneer":
    case "skrill":
      return (
        <>
          <FormInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </>
      );

    case "other":
      return (
        <>
          <FormInput
            label="Payment Method Name"
            name="payment_method_name"
            value={formData.payment_method_name}
            onChange={handleChange}
            required
          />
        </>
      );

    default:
      return null;
  }
};

export default PaymentMethodFields;
