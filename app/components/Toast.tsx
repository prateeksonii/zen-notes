import React, { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  duration = 3000,
  className = "",
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  return (
    <div
      className={`fixed z-10 top-5 left-0 right-0 mx-auto w-full text-sm max-w-sm p-3 bg-gray-200 text-gray-800 text-center rounded-lg transition-opacity duration-500 ease-in-out ${className}`}
    >
      {message}
    </div>
  );
};

export default Toast;
