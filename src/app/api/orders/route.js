import { NextResponse } from 'next/server';

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

    // In a production app, persist to database or notify team
    const orderId = `SM-${Date.now().toString().slice(-6)}`;

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order inquiry received successfully! Our team will contact you shortly.',
      order: {
        orderId,
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
