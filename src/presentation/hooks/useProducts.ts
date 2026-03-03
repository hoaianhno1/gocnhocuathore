/** @format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateProductUseCase } from "../../application/use-cases/CreateProductUseCase";
import { GetProductsUseCase } from "../../application/use-cases/GetProductsUseCase";
import type { NewProductInput, Product } from "../../domain/entities/Product";
import { FirestoreProductRepository } from "../../infrastructure/repositories/FirestoreProductRepository";

const repository = new FirestoreProductRepository();
const getProductsUseCase = new GetProductsUseCase(repository);
const createProductUseCase = new CreateProductUseCase(repository);

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const items = await getProductsUseCase.execute();
      console.log({ items });
      setProducts(items);
    } catch {
      setError("Không tải được dữ liệu sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const createProduct = useCallback(
    async (input: NewProductInput) => {
      try {
        setError(null);
        setIsCreating(true);
        await createProductUseCase.execute(input);
        await loadProducts();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Tạo sản phẩm thất bại.");
        }
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [loadProducts],
  );

  return useMemo(
    () => ({
      products,
      isLoading,
      isCreating,
      error,
      loadProducts,
      createProduct,
    }),
    [products, isLoading, isCreating, error, loadProducts, createProduct],
  );
}
