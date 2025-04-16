/**
 * Utilidades para cifrar y descifrar datos
 * Nota: Este es un cifrado simple para demostración. En producción, usa HTTPS y cifrado más robusto.
 */

// Clave de cifrado (en producción, debería venir de una variable de entorno segura)
const ENCRYPTION_KEY = "form-app-secret-key-2023"

/**
 * Cifra un objeto JSON para su envío
 */
export function encryptData(data: any): string {
  try {
    // Convertir los datos a JSON
    const jsonString = JSON.stringify(data)

    // Cifrado simple (XOR con la clave)
    let encrypted = ""
    for (let i = 0; i < jsonString.length; i++) {
      const charCode = jsonString.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      encrypted += String.fromCharCode(charCode)
    }

    // Convertir a Base64 para transmisión segura
    return btoa(encrypted)
  } catch (error) {
    console.error("Error al cifrar datos:", error)
    return ""
  }
}

/**
 * Descifra datos recibidos del servidor
 */
export function decryptData(encryptedData: string): any {
  try {
    // Decodificar de Base64
    const encrypted = atob(encryptedData)

    // Descifrar (XOR con la clave)
    let decrypted = ""
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      decrypted += String.fromCharCode(charCode)
    }

    // Convertir de JSON a objeto
    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Error al descifrar datos:", error)
    return null
  }
}
