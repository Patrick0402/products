import React from "react";
import ProductList from "../../components/product/ProductList";

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6 space-y-6 bg-gray-100 dark:bg-gray-600 overflow-hidden">
        <ProductList />
      </div>
    </div>
  );
};

export default ProductsPage;
