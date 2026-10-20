const baseUrl = (
  import.meta.env.VITE_API_BASE_URL || "/api"
).replace(/\/$/, "");

export async function request(
  path = "",
  { method = "GET", body } = {},
) {
  let response;
  try {
    response = await fetch(`${baseUrl}/items${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw {
      message:
        "We couldn’t reach FindIt. Check that the API is running, then try again.",
    };
  }
  if (response.status === 204) return null;
  let data;
  try {
    data = await response.json();
  } catch {
    throw {
      message: "The server returned an unexpected response. Please try again.",
      status: response.status,
    };
  }
  if (!response.ok) throw { ...data, status: response.status };
  return data;
}
