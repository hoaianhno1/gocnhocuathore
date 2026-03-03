import type { Product } from '../../domain/entities/Product';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  return (
    <a
      className={`product-card product-link-card ${viewMode === 'list' ? 'list' : ''}`}
      href={product.linkUrl}
      target="_blank"
      rel="noreferrer"
    >
      <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
      <h3>{product.name}</h3>
    </a>
  );
}
