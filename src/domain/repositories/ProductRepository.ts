import type { NewProductInput, Product } from '../entities/Product';

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  createProduct(input: NewProductInput): Promise<void>;
}
