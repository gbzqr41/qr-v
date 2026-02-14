
import { CategoryType, Product } from './types';

export const MENU_DATA: Product[] = [
  {
    id: '1',
    name: 'Trüflü Patates Kızartması',
    description: 'Taze parmesan peyniri, taze kekik ve trüf yağı ile harmanlanmış altın sarısı patatesler.',
    price: 145,
    category: CategoryType.STARTERS,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    calories: 450,
    ingredients: ['Patates', 'Trüf Yağı', 'Parmesan', 'Kekik']
  },
  {
    id: '2',
    name: 'Dana Bonfile Izgara',
    description: '220 gr dinlendirilmiş dana bonfile, taze kuşkonmaz ve trüf püresi eşliğinde.',
    price: 680,
    category: CategoryType.MAIN_COURSES,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    calories: 720,
    ingredients: ['Dana Bonfile', 'Kuşkonmaz', 'Patates Püresi', 'Demi-Glace Sos']
  },
  {
    id: '3',
    name: 'Signature Qresta Burger',
    description: 'Özel yapım brioche ekmeği, 180gr dana köfte, karamelize soğan ve cheddar peyniri.',
    price: 320,
    category: CategoryType.BURGERS,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    calories: 950,
    ingredients: ['Brioche Ekmek', 'Dana Köfte', 'Cheddar', 'Karamelize Soğan']
  },
  {
    id: '4',
    name: 'Fettuccine Alfredo',
    description: 'Taze krema sosu, mantar ve parmesan peyniri ile harmanlanmış ev yapımı makarna.',
    price: 280,
    category: CategoryType.PASTAS,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800',
    calories: 680,
    ingredients: ['Fettuccine', 'Mantar', 'Krema', 'Parmesan']
  },
  {
    id: '5',
    name: 'San Sebastian Cheesecake',
    description: 'İçi akışkan, üstü yanık İspanyol usulü cheesecake. Belçika çikolatası ile servis edilir.',
    price: 185,
    category: CategoryType.DESSERTS,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    calories: 520,
    ingredients: ['Labne', 'Krema', 'Yumurta', 'Çikolata Sos']
  },
  {
    id: '6',
    name: 'Taze Portakal Suyu',
    description: 'Günlük sıkılmış, 100% doğal portakal suyu.',
    price: 85,
    category: CategoryType.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800',
    calories: 120,
    ingredients: ['Portakal']
  },
  {
    id: '7',
    name: 'Limonata',
    description: 'Taze nane yaprakları ve misket limonu ile ev yapımı geleneksel limonata.',
    price: 85,
    category: CategoryType.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1523362628242-f9c3bf9ee45d?auto=format&fit=crop&q=80&w=800',
    calories: 150,
    ingredients: ['Limon', 'Taze Nane', 'Şeker']
  },
  {
    id: '8',
    name: 'Iced Latte',
    description: 'Double shot espresso, soğuk süt ve opsiyonel aromalar ile.',
    price: 95,
    category: CategoryType.HOT_DRINKS,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800',
    calories: 180,
    ingredients: ['Espresso', 'Süt', 'Buz']
  }
];
