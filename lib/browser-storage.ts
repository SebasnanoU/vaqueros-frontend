// Utilidades para manejar el almacenamiento en el navegador

/**
 * Guarda un valor en localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error(`Error al guardar en localStorage: ${key}`, error)
  }
}

/**
 * Recupera un valor de localStorage
 */
export function getFromStorage<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key)
    if (serializedValue === null) {
      return null
    }
    return JSON.parse(serializedValue) as T
  } catch (error) {
    console.error(`Error al recuperar de localStorage: ${key}`, error)
    return null
  }
}

/**
 * Elimina un valor de localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error al eliminar de localStorage: ${key}`, error)
  }
}
