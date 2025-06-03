import React, { useEffect } from "react";

export default function Toast({ message, onClose, type = "info", duration = 6000 }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => { onClose?.(); }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  let bg = "bg-blue-500";
  if (type === "error") bg = "bg-red-500";
  if (type === "success") bg = "bg-green-500";
  if (type === "warning") bg = "bg-yellow-500 text-gray-900";

  return (
    <div className={`fixed top-20 left-6 z-50 shadow-lg rounded px-4 py-3 text-white flex items-start gap-3 min-w-56 max-w-xs animate-slide-in ${bg}`} role="alert">
      <span className="flex-1">{message}</span>
      <button className="ml-2 text-white/80 hover:text-white" onClick={onClose} aria-label="Đóng">&times;</button>
    </div>
  );
}