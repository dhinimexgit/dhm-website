import { NextResponse } from "next/server";
import { getAllCareers } from "@/lib/careers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'kh';
    const careers = await getAllCareers(lang);
    return NextResponse.json(careers);
  } catch (error) {
    console.error("Error fetching careers:", error);
    return NextResponse.json([], { status: 500 });
  }
}

