export type OrderRequest = {
  paymentMethod: string;
  promotionCode?: string;
  order_items: {
    productId: number;
    quantity: number;
  }[];
};
