export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl: string;
  createdAt: string;
}

export interface NewProductInput {
  name: string;
  imageUrl: string;
  linkUrl: string;
}
