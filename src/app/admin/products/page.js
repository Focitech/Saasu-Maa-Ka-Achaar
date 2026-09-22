'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SpiroSpinner from '@/components/SpiroSpinner';
import BackButton from '@/components/BackButton';

const CATEGORIES = ['Mango', 'Classic', 'Spicy', 'Digestive', 'Special'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      showToast('Error loading products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Quick In-Stock Toggle
  const toggleStock = async (product) => {
    const updatedStatus = !product.in_stock;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, in_stock: updatedStatus } : p))
    );

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, in_stock: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${product.name} is now ${updatedStatus ? 'In Stock' : 'Out of Stock'}`);
      } else {
        showToast('Failed to update stock status');
      }
    } catch (err) {
      showToast('Network error updating stock');
    }
  };

  // Handle Photo Upload to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setEditingProduct((prev) => ({ ...prev, image_url: data.url }));
        showToast(data.devMode ? 'Photo uploaded (Dev preview ready)' : 'Photo uploaded to Cloudinary!');
      } else {
        showToast(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      showToast('Network error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.hindi_name) {
      showToast('English Name and Hindi Name are required');
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = '/api/admin/products';
      const method = isNewProduct ? 'POST' : 'PATCH';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isNewProduct ? 'New variety added to catalog!' : 'Product details saved successfully!');
        setEditingProduct(null);
        fetchProducts();
      } else {
        showToast(data.error || 'Failed to save product');
      }
    } catch (err) {
      showToast('Error saving product');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Edit Modal
  const openEdit = (product) => {
    setIsNewProduct(false);
    setEditingProduct({
      id: product.id,
      name: product.name,
      hindi_name: product.hindi_name,
      category: product.category,
      tagline: product.tagline || '',
      description: product.description || '',
      rates: product.rates || { '250g': 85, '500g': 150, '1kg': 290 },
      image_url: product.image_url || '/images/brand-poster.png',
      in_stock: product.in_stock !== false,
    });
  };

  // Open Add Product Modal
  const openAddNew = () => {
    setIsNewProduct(true);
    setEditingProduct({
      name: '',
      hindi_name: '',
      category: 'Mango',
      tagline: '',
      description: '',
      rates: { '250g': 80, '500g': 150, '1kg': 280 },
      image_url: '/images/brand-poster.png',
      in_stock: true,
    });
  };

  return (
    <div className="admin-wrapper">
      {toast && <div className="toast-msg">{toast}</div>}

      {/* Admin Top Header */}
      <header className="admin-header">
        <div className="admin-header-inner container">
          <div className="admin-brand">
            <Link href="/" className="admin-logo-wrap">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={42}
                height={42}
                className="admin-logo-img"
              />
            </Link>
            <div>
              <h1 className="admin-title">सासू माँ का अचार — Catalog Management</h1>
              <span className="admin-sub">Products, Photos & Rate Card Editor</span>
            </div>
          </div>

          <div className="admin-header-actions">
            <BackButton label="Orders" fallbackHref="/admin" />
            <Link href="/" className="admin-header-link">
              🏪 Storefront
            </Link>
            <button onClick={openAddNew} className="admin-add-product-btn">
              ➕ Add New Variety
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main container">
        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          <Link href="/admin" className="admin-tab-btn">
            📋 Orders Management
          </Link>
          <button className="admin-tab-btn active">
            🌶️ Products & Rates Catalog ({products.length})
          </button>
        </div>

        {/* Product Catalog Card */}
        <div className="admin-content-card">
          <div className="admin-catalog-top-bar">
            <div>
              <h2 className="admin-catalog-heading">Pickle Catalog & Pricing Rates</h2>
              <p className="admin-catalog-sub">
                Edit product names, pricing for 250g / 500g / 1kg sizes, descriptions, and upload jar photos to Cloudinary.
              </p>
            </div>
            <button onClick={openAddNew} className="admin-add-product-btn">
              ➕ Add Variety
            </button>
          </div>

          {isLoading ? (
            <div className="admin-table-loading">
              <SpiroSpinner size={64} label="Loading products catalog..." />
            </div>
          ) : (
            <div className="admin-products-grid">
              {products.map((prod) => (
                <div key={prod.id} className="admin-product-card">
                  <div className="admin-product-img-wrap">
                    <img
                      src={prod.image_url || '/images/brand-poster.png'}
                      alt={prod.name}
                      className="admin-product-img"
                    />
                    <span className={`admin-stock-badge ${prod.in_stock ? 'in-stock' : 'out-stock'}`}>
                      {prod.in_stock ? '● In Stock' : '✕ Out of Stock'}
                    </span>
                  </div>

                  <div className="admin-product-details">
                    <div className="admin-product-header-row">
                      <span className="admin-category-pill">{prod.category}</span>
                      <button
                        onClick={() => toggleStock(prod)}
                        className="admin-stock-toggle-btn"
                        title="Click to toggle stock"
                      >
                        {prod.in_stock ? 'Mark Out of Stock' : 'Mark In Stock'}
                      </button>
                    </div>

                    <h3 className="admin-prod-name">{prod.name}</h3>
                    <h4 className="admin-prod-hindi">{prod.hindi_name}</h4>
                    <p className="admin-prod-desc">{prod.tagline || prod.description}</p>

                    {/* Rates Pills */}
                    <div className="admin-prod-rates-row">
                      <span className="admin-rate-pill">
                        <strong>250g:</strong> ₹{prod.rates?.['250g'] || 80}
                      </span>
                      <span className="admin-rate-pill highlight">
                        <strong>500g:</strong> ₹{prod.rates?.['500g'] || 150}
                      </span>
                      <span className="admin-rate-pill">
                        <strong>1kg:</strong> ₹{prod.rates?.['1kg'] || 280}
                      </span>
                    </div>

                    <div className="admin-product-actions">
                      <button onClick={() => openEdit(prod)} className="admin-edit-btn">
                        ✏️ Edit Details & Photo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit / Add Modal Drawer */}
      {editingProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-drawer">
            <div className="admin-modal-header">
              <h3>{isNewProduct ? '➕ Add New Pickle Variety' : `✏️ Edit ${editingProduct.name}`}</h3>
              <button onClick={() => setEditingProduct(null)} className="admin-modal-close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-form">
              {/* Photo Upload Area (Cloudinary) */}
              <div className="admin-photo-upload-section">
                <div className="admin-photo-preview-box">
                  <img
                    src={editingProduct.image_url || '/images/brand-poster.png'}
                    alt="Preview"
                    className="admin-photo-preview-img"
                  />
                  {isUploading && (
                    <div className="admin-uploading-overlay">
                      <div className="auth-spinner"></div>
                      <span>Uploading to Cloudinary...</span>
                    </div>
                  )}
                </div>

                <div className="admin-photo-controls">
                  <label className="admin-field-label">Product Jar Photo (Cloudinary)</label>
                  <p className="admin-field-hint">
                    Upload a high-resolution photo of the jar. Automatically optimized & compressed via Cloudinary.
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="admin-upload-trigger-btn"
                  >
                    ☁️ {isUploading ? 'Uploading...' : 'Upload Jar Photo'}
                  </button>
                </div>
              </div>

              {/* Bilingual Names */}
              <div className="admin-form-row">
                <div className="admin-form-col">
                  <label className="admin-field-label">English Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mango Pickle"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-col">
                  <label className="admin-field-label">Hindi Name (हिंदी नाम) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. आम का अचार"
                    value={editingProduct.hindi_name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hindi_name: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Category & In-Stock */}
              <div className="admin-form-row">
                <div className="admin-form-col">
                  <label className="admin-field-label">Flavor Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="admin-input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-col">
                  <label className="admin-field-label">Stock Status</label>
                  <div className="admin-stock-checkbox-wrap">
                    <input
                      type="checkbox"
                      id="inStockCheck"
                      checked={editingProduct.in_stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.checked })}
                      className="admin-checkbox"
                    />
                    <label htmlFor="inStockCheck" className="admin-checkbox-label">
                      Available for Ordering (In Stock)
                    </label>
                  </div>
                </div>
              </div>

              {/* Dynamic Prices for 250g, 500g, 1kg */}
              <div className="admin-pricing-fieldset">
                <label className="admin-field-label">Official Rates (₹ INR)</label>
                <div className="admin-pricing-inputs-grid">
                  <div className="admin-price-input-box">
                    <span className="price-size-label">250g Jar</span>
                    <div className="price-field-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={editingProduct.rates?.['250g'] || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            rates: { ...editingProduct.rates, '250g': Number(e.target.value) },
                          })
                        }
                        className="admin-input price-input"
                      />
                    </div>
                  </div>

                  <div className="admin-price-input-box">
                    <span className="price-size-label">500g Jar</span>
                    <div className="price-field-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={editingProduct.rates?.['500g'] || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            rates: { ...editingProduct.rates, '500g': Number(e.target.value) },
                          })
                        }
                        className="admin-input price-input"
                      />
                    </div>
                  </div>

                  <div className="admin-price-input-box">
                    <span className="price-size-label">1kg Jar</span>
                    <div className="price-field-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={editingProduct.rates?.['1kg'] || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            rates: { ...editingProduct.rates, '1kg': Number(e.target.value) },
                          })
                        }
                        className="admin-input price-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="admin-field-group">
                <label className="admin-field-label">Short Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Desi Ramkela mangoes in wood-pressed mustard oil"
                  value={editingProduct.tagline}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  className="admin-input"
                />
              </div>

              {/* Full Description */}
              <div className="admin-field-group">
                <label className="admin-field-label">Full Recipe & Heritage Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe ingredients, mustard oil, secret grandma spices, sun curing..."
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="admin-input admin-textarea"
                />
              </div>

              {/* Drawer Footer Actions */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="admin-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="admin-save-btn primary-btn"
                >
                  {isSaving ? 'Saving Changes...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
