export type ProductRequest = {
  name: string; // product name
  image: File[]; // multiple images
  price: number; // product price
  categoryId: number; // category id
  rate: number; // rating
  description: string; // text description
  color: string[]; // array of colors
  status: boolean; // active/inactive
};

export type ProductUpdateRequest = {
  name: string;
  price: number;
  categoryId: number;
  description: string;
  color: string[];
  status: boolean;
};
