import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm/ProductForm";
import { createProduct } from "../../utils/firebase/firebase.utils";
import type { ProductInput } from "./product.types";

export default function ProductNew() {
  const navigate = useNavigate();

  const handleCreate = async (data: ProductInput) => {
    await createProduct(data);
    navigate("/admin/products");
  };

  return <ProductForm onSave={handleCreate} />;
}
