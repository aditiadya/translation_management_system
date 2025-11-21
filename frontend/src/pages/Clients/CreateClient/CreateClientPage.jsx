import CreateClientForm from "./CreateClientForm";
import BackButton from "../../../components/Button/BackButton";

const CreateClientPage = () => {

  return (
    <>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <BackButton to="/clients" />
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Client
            </h1>
          </div>

          <CreateClientForm />
        </div>
    </>
  );
};

export default CreateClientPage;