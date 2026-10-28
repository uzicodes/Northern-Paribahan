import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { verifyTicketAction } from '@/actions/verifyTicket';
import VerifyTicketClient from './VerifyTicketClient';
import GlobalLoader from '@/components/GlobalLoader';

export const metadata: Metadata = {
  title: 'Verify Ticket / PNR Status | Northern Paribahan',
  description: 'Verify your bus reservation status and download official E-Ticket PDF with Northern Paribahan.',
};

interface VerifyTicketPageProps {
  searchParams: Promise<{
    pnr?: string;
  }>;
}

async function VerifyTicketContent({ searchParams }: { searchParams: Promise<{ pnr?: string }> }) {
  const params = await searchParams;
  const pnr = params.pnr?.trim() || '';

  let initialTicket = null;
  let initialError: string | null = null;

  if (pnr) {
    const res = await verifyTicketAction(pnr);
    if (res.success) {
      initialTicket = res.data;
    } else {
      initialError = res.error;
    }
  }

  return (
    <VerifyTicketClient
      initialTicket={initialTicket}
      initialQuery={pnr}
      initialError={initialError}
    />
  );
}

export default function VerifyTicketPage(props: VerifyTicketPageProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex justify-center items-center min-h-[calc(100vh-140px)]"
          style={{ backgroundColor: '#C9CBA3' }}
        >
          <GlobalLoader />
        </div>
      }
    >
      <VerifyTicketContent searchParams={props.searchParams} />
    </Suspense>
  );
}


