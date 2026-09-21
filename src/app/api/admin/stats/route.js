import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const adminClient = getSupabaseAdmin();

    if (!adminClient) {
      return NextResponse.json({
        success: true,
        stats: {
          totalOrders: 28,
          totalRevenue: 6420,
          pendingOrders: 5,
          shippedOrders: 18,
          deliveredOrders: 4,
          paidOrders: 22,
        },
      });
    }

    // Parallel count queries for instant dashboard loading
    const [totalRes, pendingRes, deliveredRes, paidRes] = await Promise.all([
      adminClient.from('orders').select('total_amount', { count: 'exact' }),
      adminClient.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      adminClient.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
      adminClient.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
    ]);

    const totalOrders = totalRes.count || 0;
    const pendingOrders = pendingRes.count || 0;
    const deliveredOrders = deliveredRes.count || 0;
    const paidOrders = paidRes.count || 0;

    const totalRevenue = (totalRes.data || []).reduce(
      (sum, o) => sum + (Number(o.total_amount) || 0),
      0
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        paidOrders,
      },
    });
  } catch (err) {
    console.error('[Admin Stats API Error]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
