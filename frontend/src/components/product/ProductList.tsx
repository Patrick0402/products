"use client"

import React from "react";
import useProducts from "../../hooks/useProducts";
import ProductCard from "./ProductCard";
import Scrollbar from "../ui/Scrollbar"; 

const ProductList: React.FC = () => {
  const { products, loading, deleteProduct, handleToggleStatus, handleQuantityChange } = useProducts();

  if (loading) return <p>Carregando produtos...</p>;

  const activeProducts = Array.isArray(products)
    ? products.filter((product) => product.isActive).sort((a, b) => b.id - a.id)
    : [];

  const inactiveProducts = Array.isArray(products)
    ? products.filter((product) => !product.isActive).sort((a, b) => b.id - a.id)
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Coluna de Produtos Ativos */}
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Produtos Ativos</h3>
        <Scrollbar className="h-[70vh] bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-4 space-y-4 border border-gray-300 dark:border-gray-700">
          {activeProducts.length > 0 ? (
            activeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                onToggleStatus={handleToggleStatus}
                onQuantityChange={handleQuantityChange} 
              />
            ))
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Nenhum produto ativo encontrado.</p>
          )}
        </Scrollbar>
      </div>

      {/* Coluna de Produtos Inativos */}
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Produtos Inativos</h3>
        <Scrollbar className="h-[70vh] bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-4 space-y-4 border border-gray-300 dark:border-gray-700">
          {inactiveProducts.length > 0 ? (
            inactiveProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                onToggleStatus={handleToggleStatus}
                onQuantityChange={handleQuantityChange}
              />
            ))
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Nenhum produto inativo encontrado.</p>
          )}
        </Scrollbar>
      </div>
    </div>
  );
};

export default ProductList;
