import CreateVendorForm from "./CreateVendorForm";
import BackButton from "../../../components/Button/BackButton";

const CreateVendorPage = () => {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-5">
          <BackButton to="/vendors" />
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Vendor
          </h1>
        </div>
        <CreateVendorForm />
      </div>
    </>
  );
};

export default CreateVendorPage;