import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSessionUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, address, items, totalAmount } = body;

    if (!name || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, phone, and at least one item.' },
        { status: 400 }
      );
    }

    const session = await getSessionUser();
    const userId = session?.sub || body.userId || null;
    const email = session?.email || body.email || null;

    const orderReference = `SM-${Date.now().toString().slice(-6)}`;
    const adminClient = getSupabaseAdmin();

    let dbRecord = null;
    if (adminClient) {
      try {
        const { data, error } = await adminClient
          .from('orders')
          .insert([
            {
              order_reference: orderReference,
              user_id: userId,
              email: email,
              customer_name: name,
              phone,
              address: address || '',
              items,
              total_amount: totalAmount,
              status: 'pending'
            }
          ])
          .select()
          .single();

        if (error) {
          console.warn('Supabase order insertion warning:', error.message);
        } else {
          dbRecord = data;
        }
      } catch (dbErr) {
        console.warn('Supabase DB error:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: orderReference,
      persisted: Boolean(dbRecord),
      message: 'Order inquiry received successfully! Our team will contact you shortly.',
      order: {
        orderId: orderReference,
        name,
        phone,
        address: address || 'Not provided',
        items,
        totalAmount,
        createdAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error processing order.' },
      { status: 500 }
    );
  }
}
