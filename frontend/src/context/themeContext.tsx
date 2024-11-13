"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Definir os tipos para o contexto de tema
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Criação do contexto com valor inicial
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Função para usar o contexto de tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Provedor de tema
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Estado para armazenar o tema atual
  const [theme, setTheme] = useState<string>("light");

  // Alterar tema entre claro e escuro
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Persistir o tema no localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as string;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Sincronizar o tema com o localStorage sempre que ele for alterado
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
