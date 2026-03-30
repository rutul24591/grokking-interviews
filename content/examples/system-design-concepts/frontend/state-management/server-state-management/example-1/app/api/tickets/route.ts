import { NextResponse } from "next/server";

const tickets = [
  { id: 't1', title: 'Search index lag', status: 'investigating' },
  { id: 't2', title: 'Payments timeout burst', status: 'triaged' }
];

export async function GET() {
  return NextResponse.json(tickets);
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
  const ticket = tickets.find((entry) => entry.id === id);
  if (ticket) {
    ticket.status = ticket.status === 'investigating' ? 'triaged' : 'resolved';
  }
  return NextResponse.json({ ok: true, ticket });
}
