const BASE = 'https://fortnite-api.com'

async function handleResponse(res, label) {
  if (!res.ok) {
    throw new Error(`${label} failed: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchCosmetics() {
  const res = await fetch(`${BASE}/v2/cosmetics/br`)
  const json = await handleResponse(res, 'Cosmetics fetch')
  return json.data
}

export async function fetchShop() {
  const res = await fetch(`${BASE}/v2/shop`)
  const json = await handleResponse(res, 'Shop fetch')
  return json.data
}
