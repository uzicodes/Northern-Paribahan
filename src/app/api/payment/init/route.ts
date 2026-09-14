import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // The transactionID must be unique for every payment
    const tran_id = `NP_${Date.now()}_${Math.floor(Math.random() * 1000)}`; 
    
    const paymentData = {
      store_id: process.env.AAMARPAY_STORE_ID,
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
      cus_name: body.name,
      cus_email: body.email,
      cus_phone: body.phone,
      cus_add1: "Dhaka", // Required field
      cus_add2: "Dhaka", // Required field
      cus_city: "Dhaka", // Required field
      cus_country: "Bangladesh", // Required field
      amount: body.totalAmount, // e.g., "2950"
      tran_id: tran_id,
      currency: "BDT",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?status=success`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?status=fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?status=cancel`,
      desc: "Bus Ticket Booking - Northern Paribahan",
      type: "json"
    };

    const response = await fetch(process.env.AAMARPAY_API_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (data.result === 'true' && data.payment_url) {
      return NextResponse.json({ url: data.payment_url });
    } else {
      return NextResponse.json({ error: 'Failed to generate payment link' }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment Init Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}