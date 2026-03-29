import { NextResponse } from "next/server";
import { createPrintifyOrder } from "@/lib/printify";

// Temporary test route to exercise createPrintifyOrder with mock data.
export async function GET(req: Request) {
  console.log("[test-printify] GET received");

  const mockCustomer = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    address: "123 Test St",
    city: "New York",
    state: "NY",
    zip: "10001",
  };

  const shipping = {
    first_name: mockCustomer.firstName,
    last_name: mockCustomer.lastName,
    email: mockCustomer.email,
    phone: "",
    country: "US",
    region: mockCustomer.state,
    address1: mockCustomer.address,
    address2: "",
    city: mockCustomer.city,
    zip: mockCustomer.zip,
  };

  try {
    console.log("[test-printify] Creating Printify order", { shipping });

    const result = await createPrintifyOrder(`test-${Date.now()}`, shipping);

    console.log("[test-printify] Printify response", result);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[test-printify] Error creating Printify order:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
