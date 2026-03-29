const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY!;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!;

// 🔥 REPLACE THESE NEXT
const PRINTIFY_PRODUCT_ID = "69c847c327ac868284004850";
const PRINTIFY_VARIANT_ID = 65240; // <- we'll replace this next

export async function createPrintifyOrder(customer: any) {
  const order = {
    external_id: `order-${Date.now()}`,
    line_items: [
      {
        product_id: PRINTIFY_PRODUCT_ID,
        variant_id: PRINTIFY_VARIANT_ID,
        quantity: 1,
      },
    ],
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      country: "US",
      region: customer.state,
      address1: customer.address,
      city: customer.city,
      zip: customer.zip,
    },
  };

  const response = await fetch(
const url = `https://api.printify.com/v1/shops/${shopId}/orders.json`;    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjAxOWFjMzZiZmViZDU5OGJlOTUxZDAwNDYzM2Q2Yjc1ZDZkMWY0MTdkNjJiNTQyOTFkOGZjNTdiZjgwYzk3NDU5MGIzODRkMGZiNjgzY2RkIiwiaWF0IjoxNzc0NzMzMTA1LjA3MjYxMywibmJmIjoxNzc0NzMzMTA1LjA3MjYxNSwiZXhwIjoxODA2MjY5MTA1LjA2NjAwNywic3ViIjoiMjY4MDQyNDAiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.jqpYX7LBLq2KM8_M5f0ObKmYekSzxWwWL0HKJGJA1NJXJiU-V2z4QIzBdsu9O0urJjvx058BkOdllZ4yfsUpSjxzrGmNfb9L0R-lcfvcN6D2YS1P9cnUdQ1wosbYCn3XewywXJVxSMB10bmmRQEvOMBqZIOfuWQkVHj4oeYkXSgi20sTbO21r9Qc3mtaxfU7Hy6GB2EwxJQj4GeJOIo0-lVyvCkwndwFnXejmi2MpTMIiVXT89K-U63YrGE8LqH4guIO2CBUAEkFhe8CE-eyMkzTfZEFEkXcWQHCUiSHVBUz7a8sPEr6NGb2bwaFi6EbrHLKcoaKRkA3dMRaSuTZ2N5WMEkuo14379sESQ1bnlhYsW2rwcwJCgasbfVQVMg_VncTS9_1ZuT-8XgpL6WHLk6-JI4fWZT1VbGG7g6-wo6B5Hdq-DF1A8zPEvRTdyMoggo-6ngZkMwblm0S9It1l_r-A2l_KbJul--r8-6f-mGvxhW0chU3cmPpOUwpvme0t4NKvz1W0gP3-i28AOz-axWAM_jUKGmjrwR4oxozy8X3kQAL6OPeHWGmheoURmEgf1a52Ad3zbznqd6oQRz5n8pnykqRidFErkAJKGy8qNAdQeEX_1nl_DnxbmFCeox8nTOV--lE6HieSYbotM7sgvVqCqiwC6bNnMxJd-gx74Q}`,
      },
      body: JSON.stringify(order),
    }
  );

  return await response.json();
}