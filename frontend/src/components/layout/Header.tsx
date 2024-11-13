import React from "react";
import Button from "../ui/Button";
import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle"; 

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 p-4 bg-gray-200 shadow-md dark:bg-gray-700 dark:text-white transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between w-full px-2"> 
        {/* Logo/Texto do título */}
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Gerenciador de Produtos
        </div>

        {/* Links de navegação e botões */}
        <div className="space-x-6 flex items-center">
          {/* Links de navegação */}
          <Link href="/" passHref>
            <Button variant="link" size="medium">
              Home
            </Button>
          </Link>
          <Link href="/products" passHref>
            <Button variant="link" size="medium">
              Produtos
            </Button>
          </Link>
          <Link href="/products/register" passHref>
            <Button variant="link" size="medium">
              Registrar Produto
            </Button>
          </Link>
          
          {/* Componente de troca de tema */}
          <ThemeToggle />
          
        </div>
      </div>
    </header>
  );
};

export default Header;
