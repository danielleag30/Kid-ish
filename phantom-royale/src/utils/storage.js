const OWNED_KEY = 'phantom_owned'
const FAVORITES_KEY = 'phantom_favorites'

function readArray(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr))
}

export function getOwned() {
  return readArray(OWNED_KEY)
}

export function setOwned(idsArray) {
  writeArray(OWNED_KEY, idsArray)
}

export function getFavorites() {
  return readArray(FAVORITES_KEY)
}

export function setFavorites(idsArray) {
  writeArray(FAVORITES_KEY, idsArray)
}
