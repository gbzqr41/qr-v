
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  image: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegan?: boolean;
  calories?: number;
  ingredients: string[];
}

export enum CategoryType {
  STARTERS = 'Başlangıçlar',
  MAIN_COURSES = 'Ana Yemekler',
  BURGERS = 'Burgerler',
  PASTAS = 'Makarnalar',
  DESSERTS = 'Tatlılar',
  BEVERAGES = 'İçecekler',
  HOT_DRINKS = 'Sıcak İçecekler'
}

export interface CartItem extends Product {
  quantity: number;
}
