import { getAllUserStores } from "@/actions/store";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stores = await getAllUserStores();
    return NextResponse.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
