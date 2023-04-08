import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {});
  
  const data = await res.json();

  const players = data?.elements;

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

    
  return NextResponse.json({ players })
}