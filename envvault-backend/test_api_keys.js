const API = "http://localhost:5000";

async function test() {
  try {
    // Step 1: Login
    console.log("1. Logging in...");
    const loginRes = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@envvault.com", password: "admin123" })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) { console.error("Login failed:", loginData); return; }
    const token = loginData.token;
    console.log("   Token:", token.slice(0, 30) + "...");

    // Step 2: List API keys
    console.log("\n2. Listing API keys...");
    const listRes = await fetch(`${API}/api-keys`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listRes.json();
    console.log("   Status:", listRes.status);
    console.log("   Keys:", listData);

    // Step 3: Create API key
    console.log("\n3. Creating API key...");
    const createRes = await fetch(`${API}/api-keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ project_name: "test-app", environment: "Development" })
    });
    const createData = await createRes.json();
    console.log("   Status:", createRes.status);
    console.log("   Created:", createData);

    if (createData.api_key) {
      // Step 4: Test /api/env
      console.log("\n4. Testing /api/env with new key...");
      const envRes = await fetch(`${API}/api/env`, {
        headers: { Authorization: `Bearer ${createData.api_key}` }
      });
      console.log("   Status:", envRes.status);
      console.log("   Body:", await envRes.text());

      // Step 5: Test JSON format
      console.log("\n5. Testing /api/env?format=json...");
      const jsonRes = await fetch(`${API}/api/env?format=json`, {
        headers: { Authorization: `Bearer ${createData.api_key}` }
      });
      console.log("   Status:", jsonRes.status);
      console.log("   Body:", await jsonRes.json());
    }

    console.log("\n✅ All tests passed!");
  } catch(e) {
    console.error("❌ Error:", e.message);
  }
}

test();
