import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendTicketEmail, TicketData } from '@/lib/email';

const bstDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Dhaka',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export async function POST(request: Request) {
    try {
        // Parse the URL to get query parameters
        const url = new URL(request.url);
        const status = url.searchParams.get('status');

        // CRITICAL: aamarPay sends data as form-data (application/x-www-form-urlencoded)
        const formData = await request.formData();
        
        const pay_status = formData.get('pay_status') as string;
        const status_code = formData.get('status_code') as string;
        const mer_txnid = formData.get('mer_txnid') as string;

        console.log(`[Payment Callback] Received callback: status=${status}, status_code=${status_code}, mer_txnid=${mer_txnid}`);

        if (status === 'success' && status_code === '2') {
            try {
                // 1. Mark booking as CONFIRMED
                await prisma.booking.updateMany({
                    where: { transactionId: mer_txnid },
                    data: { status: 'CONFIRMED' }
                });
                console.log(`[Payment Callback] Booking updated to CONFIRMED for txn: ${mer_txnid}`);

                // 2. Fetch full booking details to dispatch ticket confirmation email
                try {
                    const booking = await prisma.booking.findFirst({
                        where: { transactionId: mer_txnid },
                        include: {
                            user: true,
                            tickets: {
                                orderBy: { seatNumber: 'asc' },
                            },
                            schedule: {
                                include: {
                                    bus: true,
                                    route: true,
                                },
                            },
                        },
                    });

                    if (booking && booking.user?.email) {
                        const ticketData: TicketData = {
                            ticketId: booking.id,
                            passengerName: booking.user.name || 'Valued Passenger',
                            passengerEmail: booking.user.email,
                            busModel: booking.schedule.bus?.modelName || booking.schedule.busName || 'Scania Touring HD',
                            busReg: booking.schedule.registrationNumber || booking.schedule.bus?.registrationNumber || 'NP-COACH',
                            busTier: booking.schedule.bus?.tier || 'PREMIUM',
                            origin: booking.schedule.origin || booking.schedule.route.origin,
                            destination: booking.schedule.destination || booking.schedule.route.destination,
                            departureTime: bstDateTimeFormatter.format(new Date(booking.schedule.departureTime)),
                            arrivalTime: bstDateTimeFormatter.format(new Date(booking.schedule.arrivalTime)),
                            seats: booking.tickets.map((t) => t.seatNumber),
                            totalFare: booking.totalFare,
                        };

                        console.log(`[Payment Callback] Dispatching ticket email to ${booking.user.email}...`);
                        const emailResult = await sendTicketEmail(booking.user.email, ticketData);
                        if (emailResult.success) {
                            console.log(`[Payment Callback] Ticket email dispatched successfully (ID: ${emailResult.data?.id})`);
                        } else {
                            console.error(`[Payment Callback] Ticket email dispatch returned error:`, emailResult.error);
                        }
                    } else {
                        console.warn(`[Payment Callback] Could not find booking or user email for txn: ${mer_txnid}`);
                    }
                } catch (emailErr) {
                    console.error('[Payment Callback] Error during ticket email dispatch:', emailErr);
                }
                
                const htmlString = `
                <!DOCTYPE html>
                <html>
                  <body>
                    <h2>Payment Successful. Closing window...</h2>
                    <script>
                      if (window.opener) {
                        window.opener.postMessage({ type: 'PAYMENT_SUCCESS', tran_id: '${mer_txnid}' }, '*');
                      }
                      window.close();
                    </script>
                  </body>
                </html>
                `;
                return new NextResponse(htmlString, { headers: { 'Content-Type': 'text/html' } });
            } catch (dbError) {
                console.error('DB Error updating booking:', dbError);
                const htmlString = `
                <!DOCTYPE html>
                <html>
                  <body>
                    <h2>Payment Failed. Closing window...</h2>
                    <script>
                      if (window.opener) {
                        window.opener.postMessage({ type: 'PAYMENT_FAILED', tran_id: '${mer_txnid}', reason: 'Database_Update_Failed' }, '*');
                      }
                      window.close();
                    </script>
                  </body>
                </html>
                `;
                return new NextResponse(htmlString, { headers: { 'Content-Type': 'text/html' } });
            }
        } else {
            // Payment failed or cancelled
            console.warn(`[Payment Callback] Payment not successful: status=${status}, code=${status_code}, pay_status=${pay_status}`);
            const htmlString = `
            <!DOCTYPE html>
            <html>
              <body>
                <h2>Payment Failed. Closing window...</h2>
                <script>
                  if (window.opener) {
                    window.opener.postMessage({ type: 'PAYMENT_FAILED', tran_id: '${mer_txnid}', reason: '${pay_status || 'Unknown'}' }, '*');
                  }
                  window.close();
                </script>
              </body>
            </html>
            `;
            return new NextResponse(htmlString, { headers: { 'Content-Type': 'text/html' } });
        }
    } catch (error) {
        console.error('Payment callback error:', error);
        const htmlString = `
        <!DOCTYPE html>
        <html>
          <body>
            <h2>Payment Error. Closing window...</h2>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'PAYMENT_FAILED', tran_id: 'unknown', reason: 'Internal_Error' }, '*');
              }
              window.close();
            </script>
          </body>
        </html>
        `;
        return new NextResponse(htmlString, { headers: { 'Content-Type': 'text/html' } });
    }
}
