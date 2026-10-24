const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchFromAPI(endpoint: string, fallbackData: any) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.warn(`Fallback data used for ${endpoint}`);
    return fallbackData;
  }
}
