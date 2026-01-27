import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "./ProductForm/ProductForm";
import { getProduct, updateProduct } from "../../utils/firebase/firebase.utils";
import type { Product, ProductInput } from "./product.types";

export default function ProductEdit() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!productId) {
        setErrMsg("Missing product id.");
        return;
      }

      try {
        const data = (await getProduct(productId)) as Product;
        if (alive) setProduct(data);
      } catch (e) {
        if (alive) setErrMsg("Failed to load product.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [productId]);

  const handleUpdate = async (data: ProductInput) => {
    if (!productId) return;
    await updateProduct(productId, data);
    navigate("/admin/products");
  };

  if (errMsg) return <p className="ds-error" role="alert">{errMsg}</p>;
  if (!product) return <p className="ds-muted">Loading…</p>;

  return <ProductForm initialData={product} mode="edit" onSave={handleUpdate} />;
}
