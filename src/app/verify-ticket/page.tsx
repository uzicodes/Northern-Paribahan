import React from 'react';
import { Metadata } from 'next';
import { verifyTicketAction } from '@/actions/verifyTicket';
import VerifyTicketClient from './VerifyTicketClient';

export const metadata: Metadata = {
  title: 'Verify Ticket / PNR Status | Northern Paribahan',
  description: 'Verify your bus reservation status and download official E-Ticket PDF with Northern Paribahan.',
};

interface VerifyTicketPageProps {
  searchParams: Promise<{
    pnr?: string;
  }>;
}

export default async function VerifyTicketPage(props: VerifyTicketPageProps) {
  const searchParams = await props.searchParams;
  const pnr = searchParams.pnr?.trim() || '';

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

