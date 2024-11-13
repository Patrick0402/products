"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "../../../services/api";
import { AxiosError } from "axios";
import Button from "../../../components/ui/Button";
import Notification from "../../../components/ui/Notification";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";
import ProductEditModal from "../../../components/product/ProductEditModal";
import useProducts from "../../../hooks/useProducts";
import {
  FiTrash2,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

interface ProductDetail {
  id: number;
  name: string;
  price: number | string;
  description: string;
  quantity_in_stock: number;
  category: string;
  isActive: boolean;
  onProductUpdated: () => Promise<void>;
}

const ProductDetailPage = () => {
  const { id } = useParams(); 
  const router = useRouter();
  const { handleToggleStatus, handleQuantityChange } = useProducts();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      setNotification({
        message:
          "Erro ao carregar os detalhes do produto. Tente novamente mais tarde.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const formatPrice = (price: number | string | undefined): string => {
    if (price == null || isNaN(Number(price))) return "R$ 0,00";
    return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
  };

  const handleDeleteProduct = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      await axiosInstance.delete(`/products/${id}`);
      setNotification({
        message: "Produto deletado com sucesso!",
        type: "success",
      });
      router.push("/products");
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      setNotification({ message: "Erro ao deletar o produto.", type: "error" });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleToggleProductStatus = async () => {
    if (product?.id) {
      try {
        // Chama a função que altera o status
        await handleToggleStatus(product.id, !product.isActive);

        // Atualiza o estado do produto com o novo status
        setProduct((prevProduct) =>
          prevProduct
            ? { ...prevProduct, isActive: !prevProduct.isActive }
            : prevProduct
        );

        // Fecha o modal após o status ser alterado com sucesso
        setIsStatusModalOpen(false);

        // Adicione uma notificação de sucesso, se necessário
        setNotification({
          message: "Status do produto alterado com sucesso!",
          type: "success",
        });
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error(axiosError);
        setNotification({
          message: "Erro ao alterar o status do produto.",
          type: "error",
        });
      }
    }
  };

  const handleQuantityUpdate = async (newQuantity: number) => {
    if (!product) return;

    setIsUpdatingQuantity(true);

    try {
      await handleQuantityChange(product.id, newQuantity);
      setProduct((prevProduct) =>
        prevProduct
          ? { ...prevProduct, quantity_in_stock: newQuantity }
          : prevProduct
      );
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      setNotification({
        message: "Erro ao atualizar a quantidade do produto.",
        type: "error",
      });
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const isDecrementDisabled =
    (typeof product?.quantity_in_stock === "number" &&
      product.quantity_in_stock <= 0) ||
    isUpdatingQuantity;

  const isIncrementDisabled =
    (typeof product?.quantity_in_stock === "number" &&
      product.quantity_in_stock >= 1000000) ||
    isUpdatingQuantity;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
      <div className="flex-1 max-w-4xl mx-auto bg-gray-200 dark:bg-gray-900 p-8 rounded-lg shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          {/* Nome do Produto */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {product?.name}
          </h2>

          {/* Status e Quantidade */}
          {product?.quantity_in_stock !== undefined && (
            <div className="flex items-center space-x-4">
              {/* Status: Ativo/Inativo */}
              <div className="flex items-center space-x-2">
                {product.isActive ? (
                  <FiCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                ) : (
                  <FiXCircle className="text-red-600 dark:text-red-400 text-xl" />
                )}
                <span className="text-lg text-gray-800 dark:text-gray-100">
                  {product.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>

              {/* Quantidade em Estoque */}
              <div className="flex items-center space-x-2">
                <FiPackage className="text-gray-500 dark:text-gray-300 text-xl" />
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    onClick={() =>
                      handleQuantityUpdate(product.quantity_in_stock + 1)
                    }
                    variant="quantity"
                    size="small"
                    disabled={isIncrementDisabled}
                  >
                    +
                  </Button>
                  <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {product.quantity_in_stock}
                  </span>
                  <Button
                    onClick={() =>
                      handleQuantityUpdate(product.quantity_in_stock - 1)
                    }
                    variant="quantity"
                    size="small"
                    disabled={isDecrementDisabled}
                  >
                    -
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
            duration={3000}
          />
        )}

        {isLoading ? (
          <div className="text-center text-lg text-gray-700 dark:text-gray-300">
            Carregando...
          </div>
        ) : product ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoria */}
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Categoria
                </h4>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {product.category}
                </p>
              </div>

              {/* Preço */}
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Preço
                </h4>
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div className="mt-6">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Descrição
                </h4>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Ações do Produto */}
            <div className="mt-8 flex justify-between items-center space-x-4">
              <Button
                onClick={() => window.history.back()}
                variant="secondary"
                size="medium"
              >
                Voltar para a lista
              </Button>
              <Button
                onClick={() => setIsStatusModalOpen(true)}
                variant="primary"
                size="medium"
              >
                {product.isActive ? "Desativar Produto" : "Ativar Produto"}
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="primary"
                size="medium"
              >
                Editar Produto
              </Button>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="danger"
                size="medium"
              >
                Deletar Produto
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-lg text-gray-700 dark:text-gray-300">
            Produto não encontrado
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productId={product?.id || 0}
        productName={product?.name || ""}
        productPrice={product?.price.toString() || ""}
        productAmount={product?.quantity_in_stock.toString() || ""}
        productDescription={product?.description}
        productCategory={product?.category}
        onProductUpdated={fetchProductDetails}
      />

      {/* Modal de Exclusão */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Excluir Produto"
        message="Tem certeza de que deseja excluir este produto?"
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        icon={<FiTrash2 className="text-red-600 dark:text-red-400" />}
      />

      {/* Modal de Status */}
      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleToggleProductStatus}
        title={product?.isActive ? "Desativar Produto" : "Ativar Produto"}
        message={`Tem certeza de que deseja ${
          product?.isActive ? "desativar" : "ativar"
        } este produto?`}
        confirmText={product?.isActive ? "Desativar" : "Ativar"}
        cancelText="Cancelar"
        icon={<FiRefreshCw className="text-yellow-500 dark:text-yellow-200" />}
      />
    </div>
  );
};

export default ProductDetailPage;
