export interface FieldErrors {
  productName: string;
  productPrice: string;
  productAmount: string;
  productDescription?: string;
  productCategory?: string;
}

export const validateProductFields = ({
  productName,
  productPrice,
  productAmount,
  productDescription,
  productCategory,
}: {
  productName: string;
  productPrice: string;
  productAmount: string;
  productDescription?: string;
  productCategory?: string;
}): FieldErrors => {
  const errors: FieldErrors = {
    productName: "",
    productPrice: "",
    productAmount: "",
    productDescription: "",
    productCategory: "",
  };

  const MAX_PRICE = 999999.99;
  const MAX_QUANTITY = 1000000;

  // Validação do nome
  if (!productName.trim()) {
    errors.productName = "Nome do produto é obrigatório.";
  }

  // Validação do preço
  const normalizedPrice = productPrice.replace(",", ".");
  const priceValue = parseFloat(normalizedPrice);
  if (!normalizedPrice || isNaN(priceValue)) {
    errors.productPrice = "Preço deve ser um número válido (exemplo: 79.99).";
  } else if (priceValue > MAX_PRICE) {
    errors.productPrice = `Preço não pode ser maior que R$ ${MAX_PRICE.toFixed(2)}.`;
  }

  // Validação da quantidade
  const quantityValue = Number(productAmount);
  if (!productAmount || isNaN(quantityValue) || !Number.isInteger(quantityValue) || quantityValue < 0) {
    errors.productAmount = "Quantidade deve ser um número inteiro positivo.";
  } else if (quantityValue > MAX_QUANTITY) {
    errors.productAmount = `Quantidade não pode ser maior que ${MAX_QUANTITY}.`;
  }

  // Validação da descrição
  if (productDescription && productDescription.trim().length > 500) {
    errors.productDescription = "Descrição não pode ultrapassar 500 caracteres.";
  }

  // Validação da categoria
  if (productCategory && productCategory.trim().length > 200) {
    errors.productCategory = "Categoria não pode ultrapassar 200 caracteres.";
  }

  return errors;
};
