import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-5 right-5 px-4 py-2 rounded-md shadow-lg text-white z-50 ${
              toast.type === "success" ? "bg-[#256d4d]" : "bg-[#b91c1c]"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
