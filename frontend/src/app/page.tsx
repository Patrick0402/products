"use client";

import React from "react";
import Link from "next/link";
import Button from "../components/ui/Button";

const HomePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-600 py-24">
      <div className="max-w-5xl w-full p-12 space-y-10 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-700">
        <div className="text-center">
          <h1 className="text-5xl font-semibold text-gray-800 dark:text-gray-100">
            Bem-vindo ao Gerenciador de Produtos
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mt-6">
            Gerencie seus produtos com facilidade.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link href="/products/register" passHref>
            <Button variant="primary" size="large" aria-label="Registrar novo produto">
              Registrar Produto
            </Button>
          </Link>

          <Link href="/products" passHref>
            <Button variant="primary" size="large" aria-label="Ver lista de produtos">
              Listar Produtos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
