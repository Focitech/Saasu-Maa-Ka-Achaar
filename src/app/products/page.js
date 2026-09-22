'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

const FOOD_DEPARTMENTS = [
  { id: 'achar', name: '🌶️ Homemade Achaar', desc: 'Handcrafted in Wood-Pressed Mustard Oil', active: true },
  { id: 'papad', name: '🫓 Desi Papad & Fryums', desc: 'Sun-dried Moong, Urad & Chana Papads', active: false, badge: 'Coming Soon' },
  { id: 'chutney', name: '🍯 Chutneys & Murabba', desc: 'Amla Murabba, Imli & Mint Dips', active: false, badge: 'Coming Soon' },
  { id: 'masale', name: '🌾 Hand-Ground Spices', desc: 'Stone-pounded Garam Masala & Haldi', active: false, badge: 'Coming Soon' },
  { id: 'snacks', name: '🍪 Traditional Mathri & Namkeen', desc: 'Desi Ghee Snacks & Mathri', active: false, badge: 'Coming Soon' },
];

const PICKLE_CATEGORIES = ['All', 'Mango', 'Classic', 'Spicy', 'Digestive', 'Special'];

const INITIAL_PRODUCTS = [
  {
    id: 'mango-pickle',
    name: 'Mango Pickle',
    hindiName: 'आम का अचार',
    category: 'Mango',
    image: '/images/products/mango.png',
    desc: 'Desi Ramkela mangoes marinated in pure wood-pressed mustard oil with roasted fenugreek and fennel.',
    rates: { '250g': 85, '500g': 150, '1kg': 290 },
    badge: 'Bestseller'
  },
  {
    id: 'khatal-pickle',
    name: 'Khatal Pickle',
    hindiName: 'कटहल अचार',
    category: 'Special',
    image: '/images/brand-poster.png',
    desc: 'Tender baby raw jackfruit marinated with rich Awadhi spices and pure mustard oil.',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    badge: 'Heritage'
  },
  {
    id: 'karonda-mirch-mix',
    name: 'Karonda Mirch Mix',
    hindiName: 'करोंदा मिर्च मिक्स अचार',
    category: 'Special',
    image: '/images/products/karonda.png',
    desc: 'Seasonal wild cranberries with green chillies creating an irresistible sour-spicy explosion.',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    badge: 'Seasonal'
  },
  {
    id: 'green-chilli-pickle',
    name: 'Green Chilli Pickle',
    hindiName: 'हरी मिर्च का अचार',
    category: 'Spicy',
    image: '/images/products/hari-mirch.png',
    desc: 'Farm-fresh slit green chillies packed with coarse mustard seeds and tangy amchur.',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    badge: 'Hot & Zesty'
  },
  {
    id: 'red-chilli-pickle',
    name: 'Red Chilli Pickle',
    hindiName: 'लाल मिर्च का अचार',
    category: 'Spicy',
    image: '/images/products/lal-mirch.png',
    desc: 'Authentic Banarasi thick stuffed red chillies seasoned with whole roasted spices.',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    badge: 'Banarasi Special'
  },
  {
    id: 'meetha-mango-pickle',
    name: 'Meetha Mango Pickle',
    hindiName: 'मीठा आम अचार',
    category: 'Mango',
    image: '/images/products/mango.png',
    desc: 'Traditional sun-cooked sweet & tangy mango chunda infused with desi jaggery and cardamom.',
    rates: { '250g': 85, '500g': 150, '1kg': 290 },
    badge: 'Sweet & Tangy'
  },
  {
    id: 'lahsun-pickle',
    name: 'Lahsun Pickle',
    hindiName: 'लहसुन अचार',
    category: 'Spicy',
    image: '/images/products/lahsun.png',
    desc: 'Whole peeled desi garlic cloves sautéed and pickled in crushed red chilli and mustard gravy.',
    rates: { '250g': 120, '500g': 235, '1kg': 460 },
    badge: 'Immunity'
  },
  {
    id: 'kamal-kakdi-mix',
    name: 'Kamal Kakdi Mix',
    hindiName: 'कमल ककड़ी मिक्स अचार',
    category: 'Classic',
    image: '/images/brand-poster.png',
    desc: 'Crunchy lotus stem (Bhein) pickled with seasonal carrots and cauliflower.',
    rates: { '250g': 95, '500g': 185, '1kg': 360 },
    badge: 'Crispy Mix'
  },
  {
    id: 'lemon-pickle',
    name: 'Lemon Pickle',
    hindiName: 'नींबू अचार',
    category: 'Digestive',
    image: '/images/products/lemon-jar.png',
    desc: 'Aged thin-skin Kagzi lemons cured with rock salt and ajwain. 100% oil-free and digestive.',
    rates: { '250g': 105, '500g': 205, '1kg': 400 },
    badge: 'Oil-Free'
  },
  {
    id: 'sweet-lemon',
    name: 'Sweet Lemon Pickle',
    hindiName: 'खट्टा मीठा नींबू',
    category: 'Digestive',
    image: '/images/products/lemon.png',
    desc: 'Sun-aged whole lemons slowly caramelized in natural cane sugar syrup and black salt.',
    rates: { '250g': 105, '500g': 205, '1kg': 400 },
    badge: 'Classic Sweet'
  }
];

export default function ProductsPage() {
  const [selectedDept, setSelectedDept] = useState('achar');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Checkout form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync cart with localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sasumaa_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Error loading cart', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sasumaa_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  // Fetch live products if available from API
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // Fallback to initial products
      });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product) => {
    const size = selectedSizes[product.id] || '500g';
    const price = product.rates[size];
    const itemKey = `${product.id}-${size}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.key === itemKey ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          id: product.id,
          name: product.name,
          hindiName: product.hindiName,
          size,
          price,
          qty: 1,
          image: product.image,
        },
      ];
    });

    showToast(`Added ${product.name} (${size}) to your basket!`);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.key === key) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Order Submit & WhatsApp Redirect
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      showToast('Please fill all delivery details');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName,
      phone: customerPhone,
      address: customerAddress,
      items: cart.map((item) => ({
        name: item.name,
        weight: item.size,
        qty: item.qty,
        price: item.price,
      })),
      totalAmount: cartTotal,
      paymentMethod: 'cod',
    };

    let orderRef = `SM-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success && data.order) {
        orderRef = data.order.order_reference;
      }
    } catch (err) {
      console.warn('Network issue saving order to database, falling back to direct WhatsApp dispatch');
    }

    const itemsSummary = cart
      .map((item) => `• ${item.name} (${item.size}) × ${item.qty} = ₹${item.price * item.qty}`)
      .join('\n');

    const waText = encodeURIComponent(
      `*Namaste Saasu Maa's Food!* 🙏\n` +
      `I would like to confirm my order:\n\n` +
      `*Order ID:* ${orderRef}\n` +
      `*Customer:* ${customerName}\n` +
      `*Phone:* ${customerPhone}\n` +
      `*Delivery Address:* ${customerAddress}\n\n` +
      `*Items Ordered:*\n${itemsSummary}\n\n` +
      `*Total Amount:* ₹${cartTotal}\n\n` +
      `Please confirm order preparation and dispatch schedule. Thank you!`
    );

    setCart([]);
    setIsCartOpen(false);
    setIsSubmitting(false);

    window.location.href = `https://wa.me/918979319003?text=${waText}`;
  };

  // Filter products by search and subcategory
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hindiName && p.hindiName.includes(searchQuery)) ||
      (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="products-store-page">
      {toast && <div className="toast-msg">{toast}</div>}

      {/* Top Store Header with Universal BackButton */}
      <header className="store-top-header">
        <div className="store-header-inner container">
          <div className="store-header-left">
            <BackButton label="Back to Home" fallbackHref="/" />
            <Link href="/" className="store-logo-link">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="store-logo-img"
              />
              <div>
                <span className="store-brand-title">सासू माँ का अचार</span>
                <span className="store-brand-sub">Authentic Food Store</span>
              </div>
            </Link>
          </div>

          <div className="store-header-right">
            <Link href="/account" className="store-header-action-btn">
              👤 Account
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="store-cart-trigger-btn"
              aria-label="View Cart"
            >
              🛒 Basket
              {cartItemCount > 0 && (
                <span className="store-cart-badge">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="store-main-content container">
        {/* Store Hero Banner */}
        <section className="store-hero-banner">
          <span className="store-hero-pill">Handcrafted in Wood-Pressed Mustard Oil • Bareilly, UP</span>
          <h1 className="store-page-heading">The Authentic Food Store</h1>
          <p className="store-page-desc">
            Traditional Indian pickles, artisanal sundried foods, and authentic Awadhi specialties — pure ingredients, zero chemical preservatives, crafted with motherly love.
          </p>
        </section>

        {/* Level 1: Food Department Tabs (Extensible for all future food lines) */}
        <section className="food-departments-section">
          <div className="food-dept-label-row">
            <span className="food-dept-caption">SELECT FOOD DEPARTMENT:</span>
          </div>
          <div className="food-departments-grid">
            {FOOD_DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`food-dept-card ${selectedDept === dept.id ? 'active' : ''}`}
              >
                <div className="food-dept-top">
                  <span className="food-dept-name">{dept.name}</span>
                  {dept.badge && <span className="food-dept-badge">{dept.badge}</span>}
                </div>
                <span className="food-dept-desc">{dept.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Department Content */}
        {selectedDept === 'achar' ? (
          /* ACTIVE DEPARTMENT: HOMEMADE ACHAR */
          <section className="store-catalog-section">
            <div className="store-controls-bar">
              {/* Pickle Subcategory Filters */}
              <div className="pickle-subcat-chips">
                {PICKLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pickle-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat === 'All' ? '🌶️ All Achar' : cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="store-search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search mango, lahsun, mirch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="store-search-input"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="store-products-grid">
              {filteredProducts.map((prod) => {
                const currentSize = selectedSizes[prod.id] || '500g';
                const currentPrice = prod.rates[currentSize];

                return (
                  <div key={prod.id} className="store-product-card">
                    <div className="store-card-img-wrap">
                      <Image
                        src={prod.image || '/images/brand-poster.png'}
                        alt={prod.name}
                        width={260}
                        height={260}
                        className="store-card-img"
                        style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                      />
                      {prod.badge && <span className="store-card-badge">{prod.badge}</span>}
                    </div>

                    <div className="store-card-body">
                      <div className="store-card-header">
                        <div>
                          <h3 className="store-card-name">{prod.name}</h3>
                          <h4 className="store-card-hindi">{prod.hindiName}</h4>
                        </div>
                        <div className="store-card-price-tag">
                          <span className="price-currency">₹</span>
                          <span className="price-amount">{currentPrice}</span>
                        </div>
                      </div>

                      <p className="store-card-desc">{prod.desc}</p>

                      {/* Weight Selector */}
                      <div className="store-card-size-selector">
                        {['250g', '500g', '1kg'].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(prod.id, size)}
                            className={`size-btn ${currentSize === size ? 'active' : ''}`}
                          >
                            <span>{size}</span>
                            <span className="size-rate">₹{prod.rates[size]}</span>
                          </button>
                        ))}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="store-card-actions">
                        <button
                          onClick={() => addToCart(prod)}
                          className="store-add-cart-btn"
                        >
                          🛒 Add to Basket
                        </button>
                        <a
                          href={`https://wa.me/918979319003?text=Namaste%20Saasu%20Maa%27s%20Food%2C%20I%20would%20like%20to%20order%20${encodeURIComponent(prod.name)}%20(${currentSize}%20-%20₹${currentPrice}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-wa-direct-btn"
                          title="Instant WhatsApp Order"
                        >
                          💬 Order Now
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* UPCOMING FOOD LINES TEASER (Papad, Chutneys, Spices, Snacks) */
          <section className="upcoming-dept-section">
            <div className="upcoming-dept-card">
              <div className="upcoming-icon">🧑‍🍳</div>
              <h2>{FOOD_DEPARTMENTS.find((d) => d.id === selectedDept)?.name} is Baking in Our Kitchen!</h2>
              <p>
                Our family kitchen in Bareilly is carefully testing traditional recipes with zero preservatives, pure ingredients, and timeless taste.
              </p>
              <div className="upcoming-perks-list">
                <span>✓ 100% Homemade Authenticity</span>
                <span>✓ Prepared with Motherly Love</span>
                <span>✓ Fresh Handcrafted Batches</span>
              </div>
              <a
                href={`https://wa.me/918979319003?text=Namaste%20Saasu%20Maa%27s%20Food%2C%20please%20notify%20me%20when%20${encodeURIComponent(FOOD_DEPARTMENTS.find((d) => d.id === selectedDept)?.name || 'new food items')}%20launch!`}
                target="_blank"
                rel="noopener noreferrer"
                className="upcoming-notify-btn"
              >
                🔔 Notify Me on WhatsApp When Ready
              </a>
            </div>
          </section>
        )}
      </main>

      {/* Slide-in Cart / Checkout Drawer */}
      {isCartOpen && (
        <div className="cart-drawer-overlay">
          <div className="cart-drawer">
            <div className="cart-drawer-header">
              <h3>Your Food Basket ({cartItemCount})</h3>
              <button onClick={() => setIsCartOpen(false)} className="cart-close-btn">
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty-view">
                <span>🧺</span>
                <h4>Your basket is empty</h4>
                <p>Choose your favorite pickles and add them to order directly.</p>
                <button onClick={() => setIsCartOpen(false)} className="cart-continue-btn">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="cart-drawer-body">
                {/* Cart Items List */}
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.key} className="cart-item-row">
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span className="cart-item-size">{item.size} • ₹{item.price} each</span>
                      </div>

                      <div className="cart-item-controls">
                        <button onClick={() => updateQty(item.key, -1)} className="cart-qty-btn">
                          −
                        </button>
                        <span className="cart-qty-num">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)} className="cart-qty-btn">
                          +
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        ₹{item.price * item.qty}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Summary */}
                <div className="cart-bill-summary">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="bill-row">
                    <span>Delivery</span>
                    <span style={{ color: '#79e09b' }}>Standard Courier</span>
                  </div>
                  <div className="bill-row total">
                    <strong>Total Amount</strong>
                    <strong style={{ color: 'var(--gold-accent)' }}>₹{cartTotal}</strong>
                  </div>
                </div>

                {/* Fast Checkout Form */}
                <form onSubmit={handleOrderSubmit} className="cart-checkout-form">
                  <h4 className="checkout-title">Delivery Details (Bareilly &amp; Pan-India)</h4>

                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="cart-input"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Mobile Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="cart-input"
                  />

                  <textarea
                    required
                    rows={2}
                    placeholder="Delivery Address (House no., Landmark, Pincode) *"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="cart-input"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cart-confirm-order-btn"
                  >
                    {isSubmitting ? 'Confirming Order...' : 'Confirm Order on WhatsApp 💬'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Store Footer */}
      <footer className="store-footer">
        <div className="container">
          <div className="store-footer-links">
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund">Refund Policy</Link>
            <Link href="/shipping">Shipping Policy</Link>
          </div>
          <p className="store-footer-copy">
            © 2026 Saasu Maa&apos;s Food — Handcrafted in Bareilly, UP. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
