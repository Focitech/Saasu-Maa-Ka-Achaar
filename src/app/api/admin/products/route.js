import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Default products for immediate display / fallback
const DEFAULT_PRODUCTS = [
  {
    id: 'mango-pickle',
    name: 'Mango Pickle',
    hindi_name: 'आम का अचार',
    category: 'Mango',
    image_url: '/images/products/mango.png',
    tagline: 'Desi Ramkela mangoes in wood-pressed mustard oil',
    description: 'Desi Ramkela mangoes marinated in pure wood-pressed mustard oil with roasted fenugreek and fennel.',
    rates: { '250g': 85, '500g': 150, '1kg': 290 },
    in_stock: true,
  },
  {
    id: 'khatal-pickle',
    name: 'Khatal Pickle',
    hindi_name: 'कटहल अचार',
    category: 'Special',
    image_url: '/images/brand-poster.png',
    tagline: 'Tender baby raw jackfruit marinated with rich Awadhi spices',
    description: 'Tender baby raw jackfruit marinated with rich Awadhi spices and pure mustard oil.',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    in_stock: true,
  },
  {
    id: 'lahsun-pickle',
    name: 'Garlic Pickle (Lahsun)',
    hindi_name: 'लहसुन का अचार',
    category: 'Spicy',
    image_url: '/images/products/lahsun.png',
    tagline: 'Whole desi garlic cloves steeped in mustard oil',
    description: 'Peeled whole garlic cloves infused in cold-pressed mustard oil and roasted cumin.',
    rates: { '250g': 75, '500g': 140, '1kg': 270 },
    in_stock: true,
  },
  {
    id: 'lal-mirch-pickle',
    name: 'Stuffed Red Chilli Pickle',
    hindi_name: 'लाल मिर्च बनारसी अचार',
    category: 'Spicy',
    image_url: '/images/products/lal-mirch.png',
    tagline: 'Traditional Banarasi stuffed red chillies',
    description: 'Sun-dried thick red chillies hand-stuffed with roasted amchur, saunf, and mustard oil.',
    rates: { '250g': 90, '500g': 170, '1kg': 330 },
    in_stock: true,
  },
  {
    id: 'hari-mirch-pickle',
    name: 'Green Chilli Pickle',
    hindi_name: 'हरी मिर्च अचार',
    category: 'Spicy',
    image_url: '/images/products/hari-mirch.png',
    tagline: 'Pungent green chillies with crushed rai',
    description: 'Spicy green chillies marinated with lemon juice, turmeric, and freshly ground mustard.',
    rates: { '250g': 70, '500g': 130, '1kg': 250 },
    in_stock: true,
  },
  {
    id: 'karonde-pickle',
    name: 'Karonda Pickle',
    hindi_name: 'करोंदा का अचार',
    category: 'Special',
    image_url: '/images/products/karonda.png',
    tagline: 'Rare wild natal plum with fiery green chillies',
    description: 'Tart, tangy wild karonda berries split and pickled with green chillies and methi dana.',
    rates: { '250g': 75, '500g': 140, '1kg': 270 },
    in_stock: true,
  },
  {
    id: 'khatta-nimbu-pickle',
    name: 'Khatta Nimbu Achaar',
    hindi_name: 'खट्टा नींबू अचार',
    category: 'Digestive',
    image_url: '/images/products/lemon-jar.png',
    tagline: 'Oil-free aged tangy digestive lemon pickle',
    description: 'Aged thin-skinned juicy lemons preserved with rock salt, hing, and carom seeds. Zero oil.',
    rates: { '250g': 60, '500g': 110, '1kg': 200 },
    in_stock: true,
  },
  {
    id: 'meetha-nimbu-pickle',
    name: 'Meetha Nimbu Achaar',
    hindi_name: 'मीठा नींबू अचार',
    category: 'Digestive',
    image_url: '/images/products/lemon.png',
    tagline: 'Sun-matured sweet and sour lemons with jaggery',
    description: 'Sun-matured sweet and sour lemons with black pepper and jaggery.',
    rates: { '250g': 105, '500g': 205, '1kg': 400 },
    in_stock: true,
  },
];

let inMemoryProducts = [...DEFAULT_PRODUCTS];

/**
 * GET /api/admin/products
 * Retrieves all catalog products
 */
export async function GET() {
  try {
    const adminClient = getSupabaseAdmin();

    if (!adminClient) {
      return NextResponse.json({ success: true, products: inMemoryProducts });
    }

    const { data: dbProducts, error } = await adminClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ success: true, products: inMemoryProducts });
    }

    // Format DB products
    const formatted = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      hindi_name: p.hindi_name,
      category: p.category,
      image_url: p.image_url,
      tagline: p.tagline,
      description: p.description,
      rates: p.rates || { '250g': Number(p.price) || 85, '500g': (Number(p.price) || 85) * 1.8, '1kg': (Number(p.price) || 85) * 3.4 },
      price: p.price,
      in_stock: p.in_stock !== false,
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (err) {
    console.error('[Admin Products GET Error]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/products
 * Updates product details, rates, description, stock status, or photo URL
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, name, hindi_name, category, tagline, description, rates, in_stock, image_url } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product id is required' }, { status: 400 });
    }

    const adminClient = getSupabaseAdmin();

    // Update in memory fallback
    inMemoryProducts = inMemoryProducts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          name: name ?? p.name,
          hindi_name: hindi_name ?? p.hindi_name,
          category: category ?? p.category,
          tagline: tagline ?? p.tagline,
          description: description ?? p.description,
          rates: rates ?? p.rates,
          in_stock: in_stock !== undefined ? in_stock : p.in_stock,
          image_url: image_url ?? p.image_url,
        };
      }
      return p;
    });

    if (adminClient) {
      const updates = {};
      if (name) updates.name = name;
      if (hindi_name) updates.hindi_name = hindi_name;
      if (category) updates.category = category;
      if (tagline !== undefined) updates.tagline = tagline;
      if (description !== undefined) updates.description = description;
      if (image_url) updates.image_url = image_url;
      if (in_stock !== undefined) updates.in_stock = in_stock;
      if (rates) {
        updates.price = rates['500g'] || rates['250g'] || 100;
        updates.rates = rates;
      }

      await adminClient.from('products').update(updates).eq('id', id);
    }

    const updatedProd = inMemoryProducts.find((p) => p.id === id);

    return NextResponse.json({
      success: true,
      product: updatedProd,
      message: 'Product updated successfully',
    });
  } catch (err) {
    console.error('[Admin Products PATCH Error]', err);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

/**
 * POST /api/admin/products
 * Creates a brand new pickle variety in the catalog
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, hindi_name, category, tagline, description, rates, image_url } = body;

    if (!name || !hindi_name) {
      return NextResponse.json({ success: false, error: 'Name and Hindi Name are required' }, { status: 400 });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = {
      id,
      name,
      hindi_name,
      category: category || 'Special',
      image_url: image_url || '/images/brand-poster.png',
      tagline: tagline || '',
      description: description || '',
      rates: rates || { '250g': 80, '500g': 150, '1kg': 280 },
      price: rates ? (rates['500g'] || rates['250g']) : 150,
      in_stock: true,
    };

    inMemoryProducts.push(newProduct);

    const adminClient = getSupabaseAdmin();
    if (adminClient) {
      await adminClient.from('products').insert({
        id: newProduct.id,
        name: newProduct.name,
        hindi_name: newProduct.hindi_name,
        category: newProduct.category,
        image_url: newProduct.image_url,
        tagline: newProduct.tagline,
        description: newProduct.description,
        price: newProduct.price,
        weight: '500g',
        rates: newProduct.rates,
        in_stock: true,
      });
    }

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product added successfully',
    });
  } catch (err) {
    console.error('[Admin Products POST Error]', err);
    return NextResponse.json({ success: false, error: 'Failed to add product' }, { status: 500 });
  }
}
