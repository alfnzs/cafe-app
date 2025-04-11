interface MenuItem {
  category: string;
  description: string;
  id: string;
  image_url: string;
  is_available: boolean;
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

export type { MenuItem, CartItem };
