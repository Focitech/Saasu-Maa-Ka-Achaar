import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const OFFICIAL_PRODUCTS = [
  {
    id: 'mango-pickle',
    name: 'Mango Pickle',
    hindiName: 'आम का अचार',
    category: 'Mango',
    tagline: 'Handcrafted desi Ramkela mangoes in wood-pressed mustard oil',
    description: '100% Homemade with hygiene, pure mustard oil, no palm oil, and zero preservatives.',
    image: '/images/products/mango.png',
    rates: { '250g': 85, '500g': 150, '1kg': 290 },
    defaultWeight: '500g',
    price: 150,
    badge: 'Bestseller',
    inStock: true
  },
  {
    id: 'khatal-pickle',
    name: 'Khatal Pickle',
    hindiName: 'कटहल अचार',
    category: 'Special',
    tagline: 'Tender baby raw jackfruit marinated in rich Awadhi spices',
    description: 'Authentic traditional recipe slow-cooked to perfection with cold-pressed mustard oil.',
    image: '/images/brand-poster.png',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    defaultWeight: '500g',
    price: 185,
    badge: 'Delicacy',
    inStock: true
  },
  {
    id: 'karonda-mirch-mix',
    name: 'Karonda Mirch Mix',
    hindiName: 'करोंदा मिर्च मिक्स अचार',
    category: 'Special',
    tagline: 'Rare wild natal plums paired with spicy fresh green chillies',
    description: 'Irresistible sour-spicy explosion cured in sun-warmed glass barnis.',
    image: '/images/products/karonda.png',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    defaultWeight: '500g',
    price: 185,
    badge: 'Seasonal',
    inStock: true
  },
  {
    id: 'green-chilli-pickle',
    name: 'Green Chilli Pickle',
    hindiName: 'हरी मिर्च का अचार',
    category: 'Spicy',
    tagline: 'Farm-fresh slit green chillies with crushed rai and amchur',
    description: 'Crisp and pungent chillies seasoned with whole roasted spices and mustard oil.',
    image: '/images/products/hari-mirch.png',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    defaultWeight: '500g',
    price: 185,
    badge: 'Zesty Hot',
    inStock: true
  },
  {
    id: 'red-chilli-pickle',
    name: 'Red Chilli Pickle',
    hindiName: 'लाल मिर्च का अचार',
    category: 'Spicy',
    tagline: 'Stuffed Banarasi thick red chillies infused with roasted fennel',
    description: 'Authentic Uttar Pradesh style bharwa lal mirch with rich aroma and balanced heat.',
    image: '/images/products/lal-mirch.png',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    defaultWeight: '500g',
    price: 185,
    badge: 'Traditional',
    inStock: true
  },
  {
    id: 'meetha-mango-pickle',
    name: 'Meetha Mango Pickle',
    hindiName: 'मीठा आम अचार',
    category: 'Mango',
    tagline: 'Traditional sun-cooked sweet & sour mango chunda',
    description: 'Slow sun-ripened with pure desi gur (jaggery), cardamom, and fragrant mild spices.',
    image: '/images/products/mango.png',
    rates: { '250g': 85, '500g': 150, '1kg': 290 },
    defaultWeight: '500g',
    price: 150,
    badge: 'Sweet & Tangy',
    inStock: true
  },
  {
    id: 'lahsun-pickle',
    name: 'Lahsun Pickle',
    hindiName: 'लहसुन अचार',
    category: 'Spicy',
    tagline: 'Whole peeled desi garlic cloves steeped in spicy mustard sauce',
    description: 'Immunity booster garlic cured with fenugreek, nigella, and pungent mustard gravy.',
    image: '/images/products/lahsun.png',
    rates: { '250g': 120, '500g': 235, '1kg': 460 },
    defaultWeight: '500g',
    price: 235,
    badge: 'Immunity Special',
    inStock: true
  },
  {
    id: 'kamal-kakdi-mix',
    name: 'Kamal Kakdi Mix',
    hindiName: 'कमल ककड़ी मिक्स अचार',
    category: 'Classic',
    tagline: 'Crunchy lotus stem (Bhein) pickled with seasonal winter vegetables',
    description: 'Crisp lotus root discs marinated in aromatic spices and mustard oil.',
    image: '/images/brand-poster.png',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    defaultWeight: '500g',
    price: 185,
    badge: 'Crispy Crunchy',
    inStock: true
  },
  {
    id: 'lemon-pickle',
    name: 'Lemon Pickle',
    hindiName: 'नींबू अचार',
    category: 'Digestive',
    tagline: 'Thin-skinned juicy Kagzi lemons aged with rock salt and ajwain',
    description: 'Har Khaane ka Perfect Saathi! Digestive, oil-free, aged naturally in glass jars.',
    image: '/images/products/lemon-jar.png',
    rates: { '250g': 105, '500g': 205, '1kg': 400 },
    defaultWeight: '500g',
    price: 205,
    badge: 'Digestive',
    inStock: true
  },
  {
    id: 'sweet-lemon',
    name: 'Sweet Lemon Pickle',
    hindiName: 'मीठा नींबू अचार',
    category: 'Digestive',
    tagline: 'Sun-matured sweet and sour lemons with black pepper and jaggery',
    description: 'Sweet, tangy digestive delight loved across generations with poori or parathas.',
    image: '/images/products/lemon.png',
    rates: { '250g': 105, '500g': 205, '1kg': 400 },
    defaultWeight: '500g',
    price: 205,
    badge: 'Sun-Matured',
    inStock: true
  }
];

export async function GET() {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true);

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          brand: "Saasu Maa's Food",
          source: 'supabase',
          total: data.length,
          data
        });
      }
    } catch (e) {
      console.warn('Supabase query fallback:', e.message);
    }
  }

  return NextResponse.json({
    success: true,
    brand: "Saasu Maa's Food",
    source: 'official_catalog',
    tagline: "Maa ke haath ka swaad, pyaar har baar 💗",
    total: OFFICIAL_PRODUCTS.length,
    data: OFFICIAL_PRODUCTS
  });
}
