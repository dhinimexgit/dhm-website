import { NextResponse } from "next/server";
import { getAllCareers } from "@/lib/careers";

export async function GET() {
  try {
    const careers = await getAllCareers();
    return NextResponse.json(careers);
  } catch (error) {
    console.error("Error fetching careers:", error);
    return NextResponse.json([], { status: 500 });
  }
}

