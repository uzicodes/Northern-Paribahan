import { NextResponse } from 'next/server';

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

        if (status === 'success' && status_code === '2') {
            // TODO: Update the Prisma booking status to 'PAID' using mer_txnid
            
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
        } else {
            // Payment failed or cancelled
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
