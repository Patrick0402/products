import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import { AxiosError } from "axios";
import { validateProductFields, FieldErrors } from "../../utils/validateProductFields";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  productPrice: string;
  productAmount: string;
  productDescription: string | undefined;
  productCategory: string | undefined;
  onProductUpdated: () => Promise<void>;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName: initialProductName,
  productPrice: initialProductPrice,
  productAmount: initialProductAmount,
  productDescription: initialProductDescription,
  productCategory: initialProductCategory,
  onProductUpdated,
}) => {
  const [productName, setProductName] = useState<string>(initialProductName);
  const [productPrice, setProductPrice] = useState<string>(initialProductPrice);
  const [productAmount, setProductAmount] = useState<string>(initialProductAmount);
  const [productDescription, setProductDescription] = useState<string | undefined>(initialProductDescription);
  const [productCategory, setProductCategory] = useState<string | undefined>(initialProductCategory);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    productName: "",
    productPrice: "",
    productAmount: "",
    productDescription: "",
    productCategory: "",
  });

  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    if (!isOpen) {

      setProductName(initialProductName);
      setProductPrice(initialProductPrice);
      setProductAmount(initialProductAmount);
      setProductDescription(initialProductDescription);
      setProductCategory(initialProductCategory);
      setFieldErrors({
        productName: "",
        productPrice: "",
        productAmount: "",
        productDescription: "",
        productCategory: "",
      });
    }
  }, [isOpen, initialProductName, initialProductPrice, initialProductAmount, initialProductDescription, initialProductCategory]);

  const handleValidation = (field: string, value: string) => {
    const updatedFields = {
      productName,
      productPrice,
      productAmount,
      productDescription,
      productCategory,
      [field]: value,
    };

    const validationErrors = validateProductFields(updatedFields);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validationErrors[field as keyof FieldErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const validationErrors = validateProductFields({
      productName,
      productPrice,
      productAmount,
      productDescription,
      productCategory,
    });
    setFieldErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== "")) return;

    setIsLoading(true);

    try {
      const normalizedPrice = parseFloat(productPrice.replace(",", "."));
      await axiosInstance.patch(`/products/${productId}`, {
        name: productName,
        price: normalizedPrice,
        quantity_in_stock: parseInt(productAmount),
        description: productDescription,
        category: productCategory,
      });

      setNotification({ message: "Produto atualizado com sucesso!", type: "success" });
      onProductUpdated(); 
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError.response) {
        setNotification({ message: "Erro de rede. Verifique sua conexão.", type: "error" });
      } else {
        setNotification({ message: "Erro ao atualizar o produto.", type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    productName.trim() !== "" &&
    productPrice.trim() !== "" &&
    productAmount.trim() !== "" &&
    fieldErrors.productPrice === "" &&
    fieldErrors.productAmount === "" &&
    fieldErrors.productName === "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-50 top-4 left-0 h-screen">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-6">Editar Produto</h2>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
            duration={3000}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nome e Descrição */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome do Produto"
                type="text"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  handleValidation("productName", e.target.value);
                }}
                error={fieldErrors.productName}
                required
                disabled={isLoading}
              />

              <Input
                label="Descrição do Produto"
                type="text"
                value={productDescription || ""}
                onChange={(e) => {
                  setProductDescription(e.target.value);
                  handleValidation("productDescription", e.target.value);
                }}
                error={fieldErrors.productDescription}
                disabled={isLoading}
              />
            </div>

            {/* Preço e Quantidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Preço do Produto"
                type="text"
                value={productPrice}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9,\.]/g, "");
                  value = value.replace(",", ".");
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts[1];
                  }
                  if (parts[1] && parts[1].length > 2) {
                    value = parts[0] + "." + parts[1].substring(0, 2);
                  }
                  setProductPrice(value);
                  handleValidation("productPrice", value);
                }}
                error={fieldErrors.productPrice}
                required
                disabled={isLoading}
              />

              <Input
                label="Quantidade no Estoque"
                type="text"
                value={productAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setProductAmount(value);
                  handleValidation("productAmount", value);
                }}
                error={fieldErrors.productAmount}
                required
                disabled={isLoading}
              />
            </div>

            {/* Categoria */}
            <div className="mb-4">
              <Input
                label="Categoria do Produto"
                type="text"
                value={productCategory || ""}
                onChange={(e) => {
                  setProductCategory(e.target.value);
                  handleValidation("productCategory", e.target.value);
                }}
                error={fieldErrors.productCategory}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="secondary" size="large" onClick={onClose} disabled={isLoading}>
                Fechar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="large"
                isLoading={isLoading}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Atualizando..." : "Atualizar Produto"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
