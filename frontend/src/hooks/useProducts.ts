"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../services/api";
import { AxiosError, isCancel } from "axios";

// Interface do Produto
export interface Product {
  id: number;
  name: string;
  price: number;
  quantity_in_stock: number;
  isActive: boolean;
  description?: string;
  category?: string;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false); // Controle de carregamento para quantidade

  // Função que busca os produtos
  const fetchProducts = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<Product[]>("/products", { signal });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      // Verifique se o erro é de cancelamento e ignore o log
      if (isAxiosError(error) && isCancel(error)) {
        // Apenas não logue quando for um erro de cancelamento
        return;
      } else {
        console.error("Falha ao buscar os produtos:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Hook useEffect para buscar os produtos quando o componente for montado
  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => controller.abort();
  }, [fetchProducts]);

  // Função para deletar um produto
  const deleteProduct = useCallback(async (id: number) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Falha ao deletar o produto:", error);
    }
  }, []);

  // Função para alternar o status de ativo/inativo do produto
  const handleToggleStatus = useCallback(async (id: number, isActive: boolean) => {
    try {
      await axiosInstance.patch(`/products/${id}`, { isActive });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, isActive } : product
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o status do produto", error);
    }
  }, []);

  // Função para atualizar a quantidade do produto
  const handleQuantityChange = useCallback(async (id: number, newQuantity: number) => {
    if (isUpdatingQuantity) return; // Impede múltiplas requisições enquanto já estiver atualizando
    setIsUpdatingQuantity(true); // Inicia o estado de carregamento

    try {
      await axiosInstance.patch(`/products/${id}`, { quantity_in_stock: newQuantity });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, quantity_in_stock: newQuantity } : product
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar a quantidade do produto", error);
    } finally {
      setIsUpdatingQuantity(false); // Finaliza o estado de carregamento
    }
  }, [isUpdatingQuantity]);

  return {
    products,
    loading,
    isUpdatingQuantity,
    deleteProduct,
    handleToggleStatus,
    handleQuantityChange,
  };
};

// Função de tipo de erro do Axios
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

export default useProducts;
