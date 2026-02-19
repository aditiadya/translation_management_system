import PaymentMethodManager from "../../../components/PaymentMethodManager/PaymentMethodManager";

const PaymentMethodPage = () => {
  return (
    <PaymentMethodManager
      wizardMode={false}
      backLink="/system-values"
    />
  );
};

export default PaymentMethodPage;