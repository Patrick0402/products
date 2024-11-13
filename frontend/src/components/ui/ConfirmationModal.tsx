import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  icon,
}) => {
  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <>
      {/* Fundo do Modal */}
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50"
        onClick={onClose} // Fecha o modal se clicar fora
      />
      
      {/* Conteúdo do Modal */}
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        onClick={(e) => e.stopPropagation()} // Impede o clique no conteúdo do modal de fechar o modal
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center space-x-3">
            {/* Ícone Condicional */}
            {icon && <div className="text-xl">{icon}</div>}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
