"use client";

import React, { useEffect } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

interface NotificationProps {
  message: string;
  type: "success" | "error"; 
  onClose: () => void;
  duration?: number; // Duração da notificação (em milissegundos)
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    // Fechar automaticamente após a duração especificada
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Limpar o timer se o componente desmontar ou se a notificação for fechada manualmente
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      } opacity-100`}
    >
      <div className="flex items-center">
        {type === "success" ? (
          <FiCheckCircle className="mr-2 text-white" />
        ) : (
          <FiXCircle className="mr-2 text-white" />
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-300"
          aria-label="Fechar notificação"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
