import { NextResponse } from "next/server";
import { createPrintifyOrder } from "@/lib/printify";

export async function GET() {
  const mockShipping = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    phone: "1234567890",
    country: "US",
    region: "NY",
    address1: "123 Test St",
    address2: "",
    city: "New York",
    zip: "10001",
  };
  try {
    console.log("[TestOrder] Calling createPrintifyOrder with mock data", mockShipping);
    const result = await createPrintifyOrder(`test-${Date.now()}`, mockShipping);
    console.log("[TestOrder] Printify response:", result);
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: any) {
    console.error("[TestOrder] Error sending to Printify:", err.message || err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
