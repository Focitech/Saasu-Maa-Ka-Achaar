import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSessionUser } from '@/lib/auth';

/**
 * GET /api/admin/orders
 * Query params: page (1-based), limit (default 10), status (optional), search (optional)
 * High-performance paginated queries with Supabase indexes.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;
    const adminClient = getSupabaseAdmin();

    if (!adminClient) {
      // Mock orders for dev mode when Supabase is not connected
      const mockOrders = [
        {
          id: 'mock-1',
          order_reference: 'SM-104829',
          customer_name: 'Vikram Malhotra',
          email: 'vikram@example.com',
          phone: '9876543210',
          address: 'Civil Lines, Bareilly, UP',
          items: [{ name: 'Mango Pickle', weight: '500g', qty: 2, price: 150 }],
          total_amount: 300,
          status: 'pending',
          payment_status: 'unpaid',
          payment_method: 'cod',
          created_at: new Date().toISOString(),
        },
        {
          id: 'mock-2',
          order_reference: 'SM-104830',
          customer_name: 'Pooja Verma',
          email: 'pooja@example.com',
          phone: '8765432109',
          address: 'Gomti Nagar, Lucknow, UP',
          items: [{ name: 'Lahsun Achaar', weight: '400g', qty: 1, price: 140 }],
          total_amount: 140,
          status: 'confirmed',
          payment_status: 'paid',
          payment_method: 'upi',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      return NextResponse.json({
        success: true,
        orders: mockOrders,
        pagination: {
          page: 1,
          limit,
          total: mockOrders.length,
          totalPages: 1,
        },
      });
    }

    // Build optimized Supabase query
    let query = adminClient
      .from('orders')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search.trim()) {
      const term = search.trim();
      query = query.or(`customer_name.ilike.%${term}%,phone.ilike.%${term}%,order_reference.ilike.%${term}%`);
    }

    // High performance index sorting & pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: orders, count, error } = await query;

    if (error) {
      console.error('[Admin Orders Query Error]', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      orders: orders || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error('[Admin Orders API Error]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/orders
 * Updates order status or payment status
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { orderId, status, paymentStatus, adminNotes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    const adminClient = getSupabaseAdmin();

    if (!adminClient) {
      return NextResponse.json({
        success: true,
        message: 'Order updated successfully (Dev Mode)',
        order: { id: orderId, status, paymentStatus, adminNotes },
      });
    }

    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (status) updates.status = status;
    if (paymentStatus) updates.payment_status = paymentStatus;
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;

    const { data, error } = await adminClient
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: data,
    });
  } catch (err) {
    console.error('[Admin Order Patch Error]', err);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
