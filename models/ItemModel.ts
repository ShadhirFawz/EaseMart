// Item model
export interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  ownerId: string;
  createdAt: number;
}