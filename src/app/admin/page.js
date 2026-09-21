'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SpiroSpinner from '@/components/SpiroSpinner';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS_OPTIONS = ['unpaid', 'authorized', 'paid', 'refunded', 'failed'];

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'payments'

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats', err);
    }
  }, []);

  // Fetch Paginated Orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: selectedStatus,
        search: searchQuery,
      });

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
        setPagination(data.pagination || { total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error fetching admin orders', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update Status Handler
  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdating(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        fetchStats();
      } else {
        showToast(data.error || 'Failed to update order');
      }
    } catch (err) {
      showToast('Network error updating order');
    } finally {
      setIsUpdating(null);
    }
  };

  // Update Payment Status
  const handleUpdatePayment = async (orderId, newPaymentStatus) => {
    setIsUpdating(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentStatus: newPaymentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Payment marked as ${newPaymentStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, payment_status: newPaymentStatus } : o))
        );
        fetchStats();
      } else {
        showToast(data.error || 'Failed to update payment');
      }
    } catch (err) {
      showToast('Network error updating payment');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="admin-wrapper">
      {toast && <div className="toast-msg">{toast}</div>}

      {/* Admin Top Bar */}
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
              <h1 className="admin-title">सासू माँ का अचार — Management Console</h1>
              <span className="admin-sub">Store & Orders Administration</span>
            </div>
          </div>

          <div className="admin-header-actions">
            <Link href="/" className="admin-header-link">
              🏪 Storefront
            </Link>
            <Link href="/admin/products" className="admin-header-link" style={{ borderColor: 'var(--gold-accent)', color: 'var(--gold-light)' }}>
              🌶️ Products & Rates
            </Link>
            <button
              onClick={() => {
                fetchStats();
                fetchOrders();
                showToast('Refreshed orders data');
              }}
              className="admin-refresh-btn"
              title="Refresh Data"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main container">
        {/* KPI Metrics Summary */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">📦</div>
            <div className="admin-kpi-info">
              <span className="admin-kpi-label">Total Orders</span>
              <strong className="admin-kpi-value">{stats.totalOrders}</strong>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">💰</div>
            <div className="admin-kpi-info">
              <span className="admin-kpi-label">Total Revenue</span>
              <strong className="admin-kpi-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="admin-kpi-card kpi-pending">
            <div className="admin-kpi-icon">⏳</div>
            <div className="admin-kpi-info">
              <span className="admin-kpi-label">Pending Action</span>
              <strong className="admin-kpi-value">{stats.pendingOrders}</strong>
            </div>
          </div>

          <div className="admin-kpi-card kpi-delivered">
            <div className="admin-kpi-icon">✅</div>
            <div className="admin-kpi-info">
              <span className="admin-kpi-label">Delivered Orders</span>
              <strong className="admin-kpi-value">{stats.deliveredOrders}</strong>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="admin-tabs-bar">
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders Management ({pagination.total})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            💳 Payments & Idempotency Audit
          </button>
          <Link href="/admin/products" className="admin-tab-btn">
            🌶️ Products & Rates Catalog
          </Link>
        </div>

        {activeTab === 'orders' ? (
          <div className="admin-content-card">
            {/* Filter & Search Bar */}
            <div className="admin-controls-row">
              {/* Status Filter Chips */}
              <div className="admin-filter-chips">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedStatus(st);
                      setPage(1);
                    }}
                    className={`admin-chip ${selectedStatus === st ? 'active' : ''}`}
                  >
                    {st === 'all' ? 'All Orders' : st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="admin-search-wrap">
                <span className="admin-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, phone, order ref..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="admin-search-input"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="admin-table-wrap">
              {isLoading ? (
                <div className="admin-table-loading">
                  <SpiroSpinner size={64} label="Loading orders from database..." />
                </div>
              ) : orders.length === 0 ? (
                <div className="admin-empty-state">
                  <span>📭</span>
                  <h3>No Orders Found</h3>
                  <p>There are no orders matching your current filter criteria.</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref & Date</th>
                      <th>Customer</th>
                      <th>Contact & Address</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Order Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id || ord.order_reference}>
                        <td className="admin-col-ref">
                          <strong className="order-ref-code">{ord.order_reference}</strong>
                          <span className="order-time-text">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>

                        <td className="admin-col-customer">
                          <strong>{ord.customer_name}</strong>
                          {ord.email && <span className="order-email">{ord.email}</span>}
                        </td>

                        <td className="admin-col-contact">
                          <a
                            href={`https://wa.me/91${ord.phone}?text=Namaste%20${ord.customer_name}%2C%20regarding%20your%20Saasu%20Maa%20Ka%20Achaar%20order%20${ord.order_reference}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-phone-link"
                          >
                            📞 {ord.phone}
                          </a>
                          <span className="order-address-text">{ord.address || 'Bareilly'}</span>
                        </td>

                        <td className="admin-col-items">
                          <div className="order-items-snippet">
                            {Array.isArray(ord.items) &&
                              ord.items.map((it, i) => (
                                <span key={i} className="order-item-badge">
                                  {it.name} ({it.weight}) × {it.qty}
                                </span>
                              ))}
                          </div>
                        </td>

                        <td className="admin-col-total">
                          <strong>₹{ord.total_amount}</strong>
                        </td>

                        <td className="admin-col-status">
                          <select
                            value={ord.status || 'pending'}
                            disabled={isUpdating === ord.id}
                            onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                            className={`admin-status-select status-${ord.status || 'pending'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="admin-col-payment">
                          <select
                            value={ord.payment_status || 'unpaid'}
                            disabled={isUpdating === ord.id}
                            onChange={(e) => handleUpdatePayment(ord.id, e.target.value)}
                            className={`admin-status-select payment-${ord.payment_status || 'unpaid'}`}
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="authorized">Authorized</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="admin-pagination-bar">
              <span className="pagination-info">
                Showing Page <strong>{pagination.page || 1}</strong> of{' '}
                <strong>{pagination.totalPages || 1}</strong> ({pagination.total || 0} total orders)
              </span>

              <div className="pagination-buttons">
                <button
                  disabled={!pagination.hasPrevPage || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                <button
                  disabled={!pagination.hasNextPage || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* PAYMENTS AUDIT TAB */
          <div className="admin-content-card">
            <div className="admin-payments-audit-header">
              <h3>💳 Payments & Idempotency Audit Trail</h3>
              <p>
                Each payment record contains an idempotency key to prevent double charges and duplicate order placements.
              </p>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Idempotency Key</th>
                    <th>Order Reference</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Gateway Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((ord) => (
                    <tr key={`pay-${ord.id}`}>
                      <td className="code-text font-mono">
                        idemp_{ord.order_reference?.toLowerCase() || 'key_default'}
                      </td>
                      <td>
                        <strong>{ord.order_reference}</strong>
                      </td>
                      <td>
                        <span className="admin-chip">{ord.payment_method?.toUpperCase() || 'COD'}</span>
                      </td>
                      <td>
                        <strong>₹{ord.total_amount}</strong>
                      </td>
                      <td>
                        <span
                          className={`payment-badge ${
                            ord.payment_status === 'paid' ? 'badge-paid' : 'badge-unpaid'
                          }`}
                        >
                          {ord.payment_status?.toUpperCase() || 'UNPAID'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
