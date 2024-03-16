import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

    const id = req.nextUrl.searchParams.get("id");

    const res = await fetch(`https://fplgameweekfrontendthree.azurewebsites.net/api/FocalOverallFunction?entryId=${id}`);

    const team = await res.json();

    return NextResponse.json({team});
}