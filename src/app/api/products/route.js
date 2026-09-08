import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const FALLBACK_PRODUCTS = [
  {
    id: 'aam-achaar',
    name: 'Aam Ka Achaar',
    hindiName: 'आम का अचार',
    category: 'Mango',
    tagline: 'Authentic desi mango pickle with mustard oil & secret spices',
    description: 'Handcrafted with raw ramkela mangoes, cold-pressed mustard oil, and grandma’s secret spice blend.',
    price: 249,
    weight: '500g',
    inStock: true
  },
  {
    id: 'meetha-aam',
    name: 'Meetha Aam Achaar',
    hindiName: 'मीठा आम अचार',
    category: 'Mango',
    tagline: 'Sweet, tangy, sun-cooked traditional mango chunda',
    description: 'Slow-cooked in sunlight with jaggery, cardamom, and gentle Indian spices.',
    price: 279,
    weight: '500g',
    inStock: true
  },
  {
    id: 'mix-achaar',
    name: 'Mix Achaar',
    hindiName: 'मिक्स अचार',
    category: 'Classic',
    tagline: 'Vibrant mix of seasonal vegetables and fiery spices',
    description: 'Crunchy carrots, raw mango, cauliflower, and green chillies pickled to perfection.',
    price: 239,
    weight: '500g',
    inStock: true
  },
  {
    id: 'hari-mirch',
    name: 'Hari Mirch Achaar',
    hindiName: 'हरी मिर्च अचार',
    category: 'Spicy',
    tagline: 'Zesty green chillies with crushed mustard and amchur',
    description: 'Stuffed and marinated pungent green chillies with roasted cumin and crushed rai.',
    price: 219,
    weight: '400g',
    inStock: true
  },
  {
    id: 'nimbu-achaar',
    name: 'Nimbu Achaar',
    hindiName: 'नींबू अचार',
    category: 'Digestive',
    tagline: 'Oil-free, aged tangy lemon pickle with black salt and ajwain',
    description: 'Sun-matured thin-skinned juicy lemons infused with rock salt, hing, and ajwain.',
    price: 229,
    weight: '500g',
    inStock: true
  },
  {
    id: 'lahsun-achaar',
    name: 'Lahsun Achaar',
    hindiName: 'लहसुन अचार',
    category: 'Spicy',
    tagline: 'Aromatic garlic cloves steeped in spicy mustard sauce',
    description: 'Whole desi garlic cloves steeped in roasted spices and pure mustard oil.',
    price: 269,
    weight: '400g',
    inStock: true
  },
  {
    id: 'kathal-achaar',
    name: 'Kathal Achaar',
    hindiName: 'कटहल अचार',
    category: 'Special',
    tagline: 'Tender baby raw jackfruit marinated with rich spices',
    description: 'Meaty raw jackfruit pieces seasoned with traditional Uttar Pradesh pickling recipe.',
    price: 289,
    weight: '500g',
    inStock: true
  },
  {
    id: 'karonda-achaar',
    name: 'Karonda Achaar',
    hindiName: 'करोंदा अचार',
    category: 'Special',
    tagline: 'Rare wild natal plum with fiery green chillies',
    description: 'Crisp, sour tart berries balanced with turmeric, fenugreek, and split mustard seeds.',
    price: 259,
    weight: '400g',
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
      console.warn('Failed querying Supabase products, falling back to local list:', e.message);
    }
  }

  return NextResponse.json({
    success: true,
    brand: "Saasu Maa's Food",
    source: 'local_fallback',
    tagline: "The Taste of Tradition - Made with Love",
    total: FALLBACK_PRODUCTS.length,
    data: FALLBACK_PRODUCTS
  });
}
