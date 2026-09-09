'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    hindiName: 'मीठा नींबू अचार',
    category: 'Digestive',
    image: '/images/products/lemon.png',
    desc: 'Sun-matured sweet and sour lemons with black pepper and jaggery.',
    rates: { '250g': 105, '500g': 205, '1kg': 400 },
    badge: 'Sun-Matured'
  }
];

export default function Home() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWeights, setSelectedWeights] = useState({});
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const categories = ['All', 'Mango', 'Classic', 'Spicy', 'Digestive', 'Special'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3200);
  };

  const handleWeightChange = (productId, weight) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  const addToCart = (product, weight, price) => {
    const cartItemId = `${product.id}-${weight}`;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, {
        cartItemId,
        id: product.id,
        name: product.name,
        hindiName: product.hindiName,
        weight,
        price,
        qty: 1
      }];
    });
    showToast(`Added ${product.name} (${weight}) to basket!`);
  };

  const updateQty = (cartItemId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.qty + change;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      showToast('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          items: cart,
          totalAmount
        })
      });

      const result = await res.json();
      if (result.success) {
        showToast(`Order Placed! Reference: ${result.orderId}`);
        setCart([]);
        setIsCartOpen(false);
        setCustomerInfo({ name: '', phone: '', address: '' });
      } else {
        showToast(result.message || 'Error creating order.');
      }
    } catch (err) {
      showToast('Network error submitting order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemList = cart.map(i => `${i.name} (${i.weight}) x ${i.qty} = ₹${i.price * i.qty}`).join('%0A');
    const msg = `Namaste Saasu Maa's Food!%0AI would like to order the following pickles:%0A${itemList}%0A%0ATotal: ₹${totalAmount}%0A%0APlease confirm the payment and delivery details.`;
    window.open(`https://wa.me/918979319003?text=${msg}`, '_blank');
  };

  return (
    <>
      {/* Top Brand Announcement */}
      <div className="top-announcement-bar">
        <span>BRAND- Saasu Maa&apos;s Food | Homemade Achar | Maa ke haath ka swaad 💗 | 100% Mustard Oil | No Preservatives | 💌 DM for booking or </span>
        <a href="https://wa.me/918979319003?text=Namaste%2C%20I%20would%20like%20to%20order%20Saasu%20Maa%20Ka%20Achaar" target="_blank" rel="noopener noreferrer">8979319003</a>
      </div>

      {/* Toast */}
      {toast && <div className="toast-msg">{toast}</div>}

      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-inner">
          <a href="#" className="brand-wrap">
            <Image
              src="/images/logo.jpg"
              alt="सासू माँ का अचार Logo"
              width={40}
              height={40}
              className="brand-logo-img"
              priority
            />
            <div className="brand-text">
              <h1>सासू माँ का अचार</h1>
              <span>Saasu Maa&apos;s Food • The Taste of Tradition</span>
            </div>
          </a>

          <ul className="nav-links">
            <li><a href="#varieties">Our Varieties</a></li>
            <li><a href="#price-list">Price List</a></li>
            <li><a href="#shelf">Real Jars</a></li>
            <li><a href="#heritage">Heritage & Story</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <div className="nav-actions">
            <a
              href="tel:8979319003"
              className="phone-badge-nav"
              title="Call for bookings"
            >
              📞 8979319003
            </a>
            <button
              id="cart-toggle-btn"
              className="cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="View basket"
            >
              <span className="cart-icon">🛒</span>
              <span className="cart-label">Basket</span>
              {totalItemsCount > 0 && <span className="cart-badge">{totalItemsCount}</span>}
            </button>
            <a href="#varieties" className="primary-btn desktop-nav-btn">
              Order Online
            </a>
            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-menu open">
            <a href="#varieties" onClick={() => setIsMobileMenuOpen(false)}>🌶️ Explore All Varieties</a>
            <a href="#price-list" onClick={() => setIsMobileMenuOpen(false)}>📋 Official Price List</a>
            <a href="#shelf" onClick={() => setIsMobileMenuOpen(false)}>🫙 Real Kitchen Jars</a>
            <a href="#heritage" onClick={() => setIsMobileMenuOpen(false)}>📖 Heritage & Story</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>📍 Contact Us</a>
            <div className="mobile-actions-row">
              <a href="tel:8979319003" className="secondary-btn" style={{ flex: 1, justifyContent: 'center' }}>
                📞 8979319003
              </a>
              <a
                href="https://wa.me/918979319003?text=Namaste%2C%20I%20would%20like%20to%20order%20Saasu%20Maa%20Ka%20Achaar"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">
                सासू माँ का अचार
                <span>Homemade Goodness, Crafted with Love</span>
              </h1>
              <p className="hero-subtitle">
                शुद्ध सामग्री, बेहतरीन स्वाद, और घर जैसा प्यार। Made strictly following age-old traditional recipes
                with pure wood-pressed mustard oil, handpicked spices, and natural sun curing.
              </p>

              <div className="hero-pills">
                <span className="pill-item">✓ Zero Chemical Preservatives</span>
                <span className="pill-item">✓ 100% Mustard Oil</span>
                <span className="pill-item">✓ No Palm Oil</span>
                <span className="pill-item">✓ Sun-Ripened Naturally</span>
              </div>

              <div className="hero-actions">
                <a href="#varieties" className="primary-btn">
                  Explore Varieties
                </a>
                <a href="#price-list" className="secondary-btn">
                  View Price List
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="billboard-frame">
                <Image
                  src="/images/brand-poster.png"
                  alt="सासू माँ का अचार Official Brand Poster"
                  width={440}
                  height={440}
                  priority
                />
                <div className="frame-tag">
                  सासू माँ के हाथों का स्वाद, प्यार हर बार ❤️
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Strip */}
        <section id="why-us" className="features-strip">
          <div className="container features-grid">
            <div className="feature-box">
              <div className="feature-icon">🌿</div>
              <div className="feature-info">
                <h4>100% Pure Ingredients</h4>
                <p>Selected raw spices roasted and blended in small fresh batches.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">☀️</div>
              <div className="feature-info">
                <h4>Sun-Matured Tradition</h4>
                <p>Cured naturally in glass barnis under direct Indian sunshine.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🫒</div>
              <div className="feature-info">
                <h4>Cold-Pressed Mustard Oil</h4>
                <p>Kachi Ghani mustard oil adds rich authentic aroma and preservation.</p>
              </div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">❤️</div>
              <div className="feature-info">
                <h4>Grandma&apos;s Secret Recipe</h4>
                <p>Passed down across generations with true homemaker devotion.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section with Real Product Images and Size Selector */}
        <section id="varieties" className="catalog-section">
          <div className="container">
            <div className="section-head">
              <span className="section-subtag">Signature Collection</span>
              <h2 className="section-title">Our Handcrafted Achaar Varieties</h2>
              <p className="section-desc">
                Choose your favorite authentic pickles in 250g, 500g, or 1kg jars.
              </p>
            </div>

            <div className="filter-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="products-grid">
              {filteredProducts.map((p) => {
                const currentWeight = selectedWeights[p.id] || '500g';
                const currentPrice = p.rates[currentWeight];

                return (
                  <div key={p.id} className="product-card">
                    <div className="card-top">
                      <span className="category-tag">{p.badge}</span>
                      <span style={{ fontSize: '0.8rem', color: '#9a6b1c', fontWeight: 'bold' }}>{p.category}</span>
                    </div>

                    <div className="product-img-wrap">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={280}
                        height={220}
                        className="product-card-img"
                      />
                    </div>

                    <h3 className="product-title">{p.name}</h3>
                    <div className="product-hindi">{p.hindiName}</div>
                    <p className="product-desc">{p.desc}</p>

                    {/* Weight Selector */}
                    <div className="weight-selector">
                      {['250g', '500g', '1kg'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          className={`weight-chip ${currentWeight === w ? 'active' : ''}`}
                          onClick={() => handleWeightChange(p.id, w)}
                        >
                          {w}
                        </button>
                      ))}
                    </div>

                    <div className="product-meta">
                      <div className="price-box">
                        <span className="price">₹{currentPrice}</span>
                        <span className="weight">/ {currentWeight} jar</span>
                      </div>
                    </div>

                    <button
                      id={`add-btn-${p.id}`}
                      className="add-btn"
                      onClick={() => addToCart(p, currentWeight, currentPrice)}
                    >
                      <span>Add to Basket +</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Official Rate Card & Price List Section */}
        <section id="price-list" className="price-list-section">
          <div className="container">
            <div className="section-head">
              <span className="section-subtag">Official Rate Card</span>
              <h2 className="section-title">Saasu Maa Ka Achaar Price List</h2>
              <p className="section-desc">
                Clear, transparent rates for all homemade varieties. Handcrafted fresh with pure ingredients.
              </p>
            </div>

            <div className="price-list-grid">
              <div className="price-list-poster-frame">
                <Image
                  src="/images/price-list.png"
                  alt="Official Price List Poster"
                  width={750}
                  height={500}
                />
              </div>

              <div className="price-table-card">
                <h3 style={{ color: 'var(--primary-maroon)', fontSize: '1.25rem', marginBottom: '8px' }}>
                  Complete Sizing & Pricing
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', marginBottom: '14px' }}>
                  All prices in INR. Minimum order and custom packaging available on inquiry.
                </p>

                <table className="price-table">
                  <thead>
                    <tr>
                      <th>Pickle Variety</th>
                      <th>250g</th>
                      <th>500g</th>
                      <th>1kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#9a6b1c' }}>{p.hindiName}</div>
                        </td>
                        <td className="rate-badge">₹{p.rates['250g']}</td>
                        <td className="rate-badge">₹{p.rates['500g']}</td>
                        <td className="rate-badge">₹{p.rates['1kg']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <a
                    href="https://wa.me/918979319003?text=Namaste%2C%20I%20would%20like%20to%20order%20pickles%20from%20the%20price%20list."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    💬 Order Directly via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Kitchen Jars Shelf Showcase */}
        <section id="shelf" className="real-shelf-section">
          <div className="container shelf-grid">
            <div className="shelf-img-frame">
              <Image
                src="/images/real-jars.png"
                alt="Real Pickles on Kitchen Shelf"
                width={560}
                height={560}
              />
            </div>
            <div>
              <span className="section-subtag">Direct from Our Kitchen</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-deep)', marginBottom: '16px', lineHeight: '1.2' }}>
                Asli Ghar Ka Swad, Bottled with Hygiene & Love
              </h2>
              <p style={{ color: 'var(--muted-text)', lineHeight: '1.7', marginBottom: '20px' }}>
                Every jar of Saasu Maa Ka Achaar is made in small, hygienic batches.
                We use pure wood-pressed mustard oil, selected whole spices, and age-old traditional recipes
                with zero chemicals, palm oil, or artificial colors.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '26px' }}>
                <div>✓ <strong>100% Home Made with Hygiene</strong></div>
                <div>✓ <strong>No Palm Oil • No Chemical Preservatives</strong></div>
                <div>✓ <strong>Available in Premium Sealed Barnis & Jars</strong></div>
                <div>✓ <strong>Fast Delivery Across India</strong></div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#varieties" className="primary-btn">
                  Shop Now
                </a>
                <a href="tel:8979319003" className="secondary-btn">
                  📞 Call: 8979319003
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section id="heritage" className="about-section">
          <div className="container about-grid">
            <div className="about-text">
              <span className="section-subtag">The Journey</span>
              <h2>सासू माँ के हाथों का स्वाद, प्यार हर बार</h2>
              <p>
                Every spoonful of Saasu Maa Ka Achaar holds the warmth of a mother’s kitchen.
                Started as a family legacy in making traditional pickles for relatives and festive gatherings,
                we continue to prepare small batches with pristine hygiene and time-tested recipes.
              </p>
              <div className="heritage-quote">
                &ldquo;अचार सिर्फ स्वाद नहीं, पीढ़ियों की यादें और प्यार की मिठास है।&rdquo;
              </div>

              <div className="about-stats">
                <div className="stat-card">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Natural & Desi</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Authentic Varieties</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0%</div>
                  <div className="stat-label">Preservatives</div>
                </div>
              </div>
            </div>

            <div className="about-logo-frame">
              <Image
                src="/images/logo.jpg"
                alt="Saasu Maa Authentic Kitchen Seal"
                width={320}
                height={320}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Cart & Quick Order Modal */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Your Pickles Basket ({totalItemsCount})</h3>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '30px 0', color: '#888' }}>
                Your basket is empty. Choose your favorite pickles to get started!
              </p>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="cart-item-row">
                      <div>
                        <div className="item-name">{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                          ₹{item.price} each • {item.weight} ({item.hindiName})
                        </div>
                      </div>
                      <div className="item-qty-wrap">
                        <button className="qty-btn" onClick={() => updateQty(item.cartItemId, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.cartItemId, 1)}>+</button>
                        <span style={{ fontWeight: '700', marginLeft: '10px' }}>₹{item.price * item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', margin: '16px 0' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--primary-maroon)' }}>₹{totalAmount}</span>
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                  <button
                    className="secondary-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={openWhatsAppOrder}
                  >
                    💬 Quick Order via WhatsApp
                  </button>
                </div>

                <form onSubmit={handleOrderSubmit} className="order-form">
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <textarea
                      placeholder="Delivery Address & City *"
                      rows={2}
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Order...' : 'Confirm Delivery Inquiry'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Saasu Maa&apos;s Food</h3>
              <p>
                Crafting authentic homemade Indian pickles with tradition, love, and purity.
                Delivering traditional taste straight to your dining table.
              </p>
            </div>

            <div className="footer-links">
              <h4>Pickle Varieties</h4>
              <ul>
                <li><a href="#varieties">Mango Pickle (आम का अचार)</a></li>
                <li><a href="#varieties">Lahsun Pickle (लहसुन अचार)</a></li>
                <li><a href="#varieties">Green Chilli (हरी मिर्च)</a></li>
                <li><a href="#varieties">Lemon Pickle (नींबू अचार)</a></li>
                <li><a href="#price-list">Official Price List</a></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Get in Touch</h4>
              <p>📍 Traditional Homemade Kitchen, India</p>
              <p>💌 <strong>Booking:</strong> 8979319003</p>
              <p>📞 <strong>Phone:</strong> <a href="tel:8979319003" style={{ color: 'var(--gold-light)' }}>+91 8979319003</a></p>
              <p>💬 <strong>WhatsApp:</strong> <a href="https://wa.me/918979319003" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-light)' }}>Chat on WhatsApp</a></p>
            </div>
          </div>

          <div className="footer-bottom">
            © 2026 Saasu Maa&apos;s Food. All Rights Reserved. Maa ke haath ka swaad 💗
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="floating-contact-bar">
        <a
          href="https://wa.me/918979319003?text=Namaste%20Saasu%20Maa%27s%20Food%2C%20I%20would%20like%20to%20order%20homemade%20achar."
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-btn-wa"
          aria-label="Chat on WhatsApp"
        >
          <span>💬</span>
          <span className="label-text">WhatsApp 8979319003</span>
        </a>
        <a
          href="tel:8979319003"
          className="floating-btn floating-btn-call"
          aria-label="Call directly"
        >
          <span>📞</span>
          <span className="label-text">Call 8979319003</span>
        </a>
      </div>
    </>
  );
}
