import CreateProjectForm from "./CreateProjectForm";
import BackButton from "../../../components/Button/BackButton";

const CreateProjectPage = () => {

  return (
    <>
        <div>
          <div className="flex items-center gap-3 mb-5">
            <BackButton to="/projects" />
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Project
            </h1>
          </div>

          <CreateProjectForm />
        </div>
    </>
  );
};

export default CreateProjectPage;