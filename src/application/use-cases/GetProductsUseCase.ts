import type { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class GetProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.repository.getProducts();
  }
}
