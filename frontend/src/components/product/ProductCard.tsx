"use client";

import React, { useState } from "react";
import { Product } from "../../hooks/useProducts";
import Button from "../ui/Button";
import { FiCheckCircle, FiXCircle, FiTrash2, FiRefreshCw, FiPackage } from "react-icons/fi";
import ConfirmationModal from "../ui/ConfirmationModal";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  onQuantityChange: (id: number, newQuantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDelete,
  onToggleStatus,
  onQuantityChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "toggle" | null>(null);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  const formatPrice = (price: number | string) =>
    `R$${(typeof price === "number" ? price : parseFloat(price)).toFixed(2)}`;

  const openModal = (action: "delete" | "toggle") => {
    setActionType(action);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (actionType === "delete") {
      onDelete(product.id);
    } else if (actionType === "toggle") {
      onToggleStatus(product.id, !product.isActive);
    }
    setIsModalOpen(false);
  };

  const handleQuantityUpdate = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= 1000000) {
      setIsUpdatingQuantity(true);
      onQuantityChange(product.id, newQuantity);
      setIsUpdatingQuantity(false);
    }
  };

  const isDecrementDisabled = isUpdatingQuantity || product.quantity_in_stock <= 0;
  const isIncrementDisabled = isUpdatingQuantity || product.quantity_in_stock >= 1000000;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:translate-y-1 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600">
      {/* Link para redirecionar ao produto */}
      <Link href={`/products/${product.id}`} passHref>
        <div className="flex flex-col h-full justify-between cursor-pointer">
          {/* Nome e Status */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{product.name}</h3>
              {product.isActive ? (
                <FiCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              ) : (
                <FiXCircle className="text-red-600 dark:text-red-400 text-xl" />
              )}
            </div>
            {/* Quantidade em Estoque */}
            <div className="flex items-center space-x-2">
              <FiPackage className="text-gray-500 dark:text-gray-300 text-xl" />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {product.quantity_in_stock}
              </span>
            </div>
          </div>

          {/* Preço */}
          <p className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">{formatPrice(product.price)}</p>
        </div>
      </Link>

      {/* Botões de Ação */}
      <div className="flex justify-between space-x-2 mt-auto">
        <div className="flex items-center space-x-2">
          {/* Botões de Incrementar/Decrementar */}
          <Button
            onClick={(e) => {
              e.stopPropagation();  // Evita o redirecionamento ao clicar nos botões
              handleQuantityUpdate(product.quantity_in_stock + 1);
            }}
            variant="quantity"
            size="small"
            disabled={isIncrementDisabled}
          >
            +
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();  // Evita o redirecionamento ao clicar nos botões
              handleQuantityUpdate(product.quantity_in_stock - 1);
            }}
            variant="quantity"
            size="small"
            disabled={isDecrementDisabled}
          >
            -
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();  // Evita o redirecionamento ao clicar no botão de status
              openModal("toggle");
            }}
          >
            {product.isActive ? "Desativar" : "Ativar"}
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={(e) => {
              e.stopPropagation();  // Evita o redirecionamento ao clicar no botão de excluir
              openModal("delete");
            }}
          >
            Deletar
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        title={
          actionType === "delete"
            ? "Confirmar Exclusão"
            : "Confirmar Alteração de Status"
        }
        message={actionType === "delete" ? "Tem certeza de que deseja excluir este produto?" : `Tem certeza de que deseja ${product.isActive ? "desativar" : "ativar"} este produto?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        icon={
          actionType === "delete" ? (
            <FiTrash2 className="text-red-600 dark:text-red-400" />
          ) : (
            <FiRefreshCw className="text-yellow-500 dark:text-yellow-200" />
          )
        }
      />
    </div>
  );
};

export default ProductCard;
