"use client"; 

import React from "react";
import ProductForm from "@/components/product/ProductForm";  

const RegisterProductPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
        <ProductForm />
    </div>
  );
};

export default RegisterProductPage;
