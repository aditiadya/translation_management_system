import CreateManagerForm from "./CreateManagerForm";
import BackButton from "../../../components/Button/BackButton";

const CreateManagerPage = () => {

  return (
    <>
        <div>
          <div className="flex items-center gap-3 mb-5">
            <BackButton to="/managers" />
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Manager
            </h1>
          </div>

          <CreateManagerForm />
        </div>
    </>
  );
};

export default CreateManagerPage;