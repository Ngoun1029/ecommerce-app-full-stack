export type ProductResponse = {
  id: number;
  name: string;
  image: string;
  price: number;
  categoryId: number;
  rate: number;
  description: string;
  color: [];
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductListResponse = {
  id: number;
  name: string;
  image: string;
};
