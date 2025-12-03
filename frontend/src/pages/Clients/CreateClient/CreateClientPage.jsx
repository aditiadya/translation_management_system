import CreateClientForm from "./CreateClientForm";
import BackButton from "../../../components/Button/BackButton";

const CreateClientPage = () => {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-5">
          <BackButton to="/clients" />
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Client
          </h1>
        </div>

        <CreateClientForm />
      </div>
    </>
  );
};

export default CreateClientPage;