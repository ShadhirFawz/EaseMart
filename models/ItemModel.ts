// Item model
export interface Item {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sellerId: string;
  createdAt: number;
}