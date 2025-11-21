import { useState } from "react";
import CreateVendorForm from "./CreateVendorForm";

const CreateVendorPage = () => {

  return (
    <>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Create New Vendor
          </h2>
          <CreateVendorForm />
        </div>
    </>
  );
};

export default CreateVendorPage;