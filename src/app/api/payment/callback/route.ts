
import { redirect } from 'next/navigation';

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
            redirect(`/booking/success?tran_id=${mer_txnid}`);
        } else {
            // Payment failed or cancelled
            redirect(`/booking/failed?tran_id=${mer_txnid}&reason=${pay_status || 'Unknown'}`);
        }
    } catch (error) {
        // Handle any parsing or redirect errors gracefully
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            // Rethrow next/navigation redirects as they are expected exceptions
            throw error;
        }
        
        console.error('Payment callback error:', error);
        
        // Fallback redirect on internal error
        redirect('/booking/failed?tran_id=unknown&reason=Internal_Error');
    }
}
