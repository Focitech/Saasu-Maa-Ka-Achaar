'use client';

import { useState } from 'react';
import Image from 'next/image';

const INITIAL_PRODUCTS = [
  {
    id: 'aam-ka-achaar',
    name: 'Aam Ka Achaar',
    hindiName: 'आम का अचार',
    category: 'Mango',
    icon: '🥭',
    desc: 'Desi Ramkela mangoes marinated in pure wood-pressed mustard oil with roasted fenugreek and fennel.',
    price: 249,
    weight: '500g',
    badge: 'Bestseller'
  },
  {
    id: 'meetha-aam',
    name: 'Meetha Aam Achaar',
    hindiName: 'मीठा आम अचार',
    category: 'Mango',
    icon: '🍯',
    desc: 'Traditional sun-cooked sweet & tangy mango chunda infused with jaggery and aromatic cardamom.',
    price: 279,
    weight: '500g',
    badge: 'Tradition'
  },
  {
    id: 'mix-achaar',
    name: 'Mix Achaar',
    hindiName: 'मिक्स अचार',
    category: 'Classic',
    icon: '🥕',
    desc: 'Crisp hand-cut carrots, tender cauliflower, mango chunks and chillies soaked in spicy mustard brine.',
    price: 239,
    weight: '500g',
    badge: 'Popular'
  },
  {
    id: 'hari-mirch',
    name: 'Hari Mirch Achaar',
    hindiName: 'हरी मिर्च अचार',
    category: 'Spicy',
    icon: '🌶️',
    desc: 'Spicy farm-fresh green chillies hand-slit and filled with coarse mustard seeds and tangy amchur.',
    price: 219,
    weight: '400g',
    badge: 'Hot & Zesty'
  },
  {
    id: 'nimbu-achaar',
    name: 'Nimbu Achaar',
    hindiName: 'नींबू अचार',
    category: 'Digestive',
    icon: '🍋',
    desc: 'Aged thin-skin kagzi lemons cured with rock salt and ajwain. 100% oil-free and great for digestion.',
    price: 229,
    weight: '500g',
    badge: 'Oil-Free'
  },
  {
    id: 'lahsun-achaar',
    name: 'Lahsun Achaar',
    hindiName: 'लहसुन अचार',
    category: 'Spicy',
    icon: '🧄',
    desc: 'Whole peeled garlic cloves sautéed and pickled in crushed red chilli and mustard gravy.',
    price: 269,
    weight: '400g',
    badge: 'Immunity'
  },
  {
    id: 'kathal-achaar',
    name: 'Kathal Achaar',
    hindiName: 'कटहल अचार',
    category: 'Special',
    icon: '🪴',
    desc: 'Tender baby jackfruit slow-cooked and steeped in authentic Awadhi pickling spices.',
    price: 289,
    weight: '500g',
    badge: 'Heritage'
  },
  {
    id: 'karonda-achaar',
    name: 'Karonda Achaar',
    hindiName: 'करोंदा अचार',
    category: 'Special',
    icon: '🍒',
    desc: 'Seasonal wild cranberries with green chillies creating an irresistible sour-spicy explosion.',
    price: 259,
    weight: '400g',
    badge: 'Seasonal'
  }
];

export default function Home() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    showToast(`Added ${product.name} to your basket!`);
  };

  const updateQty = (id, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
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
      // Call Next.js backend API
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
    const msg = `Namaste Saasu Maa's Food!%0AI would like to order the following pickles:%0A${itemList}%0A%0ATotal: ₹${totalAmount}%0A%0APlease let me know the payment and delivery details.`;
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
            <li><a href="#heritage">Heritage & Story</a></li>
            <li><a href="#why-us">Why Choose Us</a></li>
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
            <a href="#heritage" onClick={() => setIsMobileMenuOpen(false)}>📖 Heritage & Story</a>
            <a href="#why-us" onClick={() => setIsMobileMenuOpen(false)}>✨ Why Choose Us</a>
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
                <span className="pill-item">✓ Pure Mustard Oil</span>
                <span className="pill-item">✓ Authentic Desi Recipes</span>
                <span className="pill-item">✓ Sun-Ripened Naturally</span>
              </div>

              <div className="hero-actions">
                <a href="#varieties" className="primary-btn">
                  Explore Varieties
                </a>
                <button
                  className="secondary-btn"
                  onClick={() => {
                    const el = document.getElementById('heritage');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Our Heritage Story
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="billboard-frame">
                <Image
                  src="/images/billboard.png"
                  alt="सासू माँ का अचार Billboard Showcase"
                  width={420}
                  height={620}
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

        {/* Catalog Section */}
        <section id="varieties" className="catalog-section">
          <div className="container">
            <div className="section-head">
              <span className="section-subtag">Signature Collection</span>
              <h2 className="section-title">Our Handcrafted Achaar Varieties</h2>
              <p className="section-desc">
                From pungent raw mango to sun-cured oil-free lemons, discover the authentic taste of tradition.
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
              {filteredProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="card-top">
                    <span className="category-tag">{p.badge}</span>
                    <span style={{ fontSize: '0.8rem', color: '#9a6b1c', fontWeight: 'bold' }}>{p.category}</span>
                  </div>

                  <div className="jar-icon-placeholder">{p.icon}</div>

                  <h3 className="product-title">{p.name}</h3>
                  <div className="product-hindi">{p.hindiName}</div>
                  <p className="product-desc">{p.desc}</p>

                  <div className="product-meta">
                    <div className="price-box">
                      <span className="price">₹{p.price}</span>
                      <span className="weight">/ {p.weight} jar</span>
                    </div>
                  </div>

                  <button
                    id={`add-btn-${p.id}`}
                    className="add-btn"
                    onClick={() => addToCart(p)}
                  >
                    <span>Add to Basket +</span>
                  </button>
                </div>
              ))}
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
                  <div className="stat-number">8+</div>
                  <div className="stat-label">Traditional Varieties</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0%</div>
                  <div className="stat-label">Artificial Chemicals</div>
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
                    <div key={item.id} className="cart-item-row">
                      <div>
                        <div className="item-name">{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>₹{item.price} each • {item.weight}</div>
                      </div>
                      <div className="item-qty-wrap">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
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
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#varieties">Aam Ka Achaar</a></li>
                <li><a href="#varieties">Hari Mirch Achaar</a></li>
                <li><a href="#varieties">Nimbu Achaar</a></li>
                <li><a href="#heritage">Our Heritage</a></li>
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
