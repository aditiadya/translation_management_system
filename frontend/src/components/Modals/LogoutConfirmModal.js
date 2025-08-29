import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "../Button/LogoutButton";

const LogoutConfirmModal = ({ onCancel, onLogout }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* Animated Card */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl w-11/12 sm:w-[420px] p-8 text-center"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Confirm Logout
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to log out? You’ll need to log in again to
            access your account.
          </p>

          <div className="flex justify-center gap-20">
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <LogoutButton onLogout={onLogout} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
