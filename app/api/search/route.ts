import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

    const id = req.nextUrl.searchParams.get("id");

    if (!id || id === '0') {
        return NextResponse.json({ error: "id parameter must be provided and not '0'" }, { status: 400 });
    }
    
    try {
        // Fetch data from the external API using the provided 'id'
        const res = await fetch(`https://fplgameweekfrontendthree.azurewebsites.net/api/FocalOverallFunction?entryId=${id}`);

        // Check if the response is successful
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);  
        }

        // Parse the JSON response
        const team = await res.json();

        // Return the fetched data as a JSON response
        return NextResponse.json({ team });
    } catch (error) {
        // Handle any errors that occur during the fetch process
        return NextResponse.json({ error }, { status: 500 });
    }
}