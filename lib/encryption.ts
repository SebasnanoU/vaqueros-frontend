/**
 * Utilidades para cifrar y descifrar datos
 * Implementación mejorada con cifrado más robusto
 */

// Clave de cifrado desde variables de entorno (con fallback para compatibilidad)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "form-app-secret-key-2023-improved-security"
const ENCRYPTION_VERSION = process.env.NEXT_PUBLIC_ENCRYPTION_VERSION || "2.0"
const ENABLE_ENCRYPTION = process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION !== "false"

/**
 * Cifra un objeto JSON para su envío
 * Utiliza un algoritmo más seguro que el XOR simple
 */
export function encryptData(data: any): string {
  // Si el cifrado está desactivado, devolver una versión codificada en base64
  if (!ENABLE_ENCRYPTION) {
    return btoa(
      JSON.stringify({
        data: JSON.stringify(data),
        timestamp: Date.now(),
        version: "plain",
      }),
    )
  }

  try {
    // Convertir los datos a JSON
    const jsonString = JSON.stringify(data)

    // Crear un vector de inicialización (IV) aleatorio
    const iv = generateRandomString(16)

    // Cifrar los datos usando AES-like con el IV
    const encrypted = customAESEncrypt(jsonString, ENCRYPTION_KEY, iv)

    // Combinar IV y datos cifrados, y convertir a Base64
    const result = btoa(
      JSON.stringify({
        iv,
        data: encrypted,
        timestamp: Date.now(),
        version: ENCRYPTION_VERSION,
      }),
    )

    return result
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
    const parsed = JSON.parse(atob(encryptedData))

    // Extraer IV y datos cifrados
    const { iv, data, version } = parsed

    // Verificar si los datos no están cifrados
    if (version === "plain") {
      return JSON.parse(data)
    }

    // Verificar la versión del cifrado
    if (version === "2.0") {
      // Descifrar usando AES-like
      const decrypted = customAESDecrypt(data, ENCRYPTION_KEY, iv)

      // Convertir de JSON a objeto
      return JSON.parse(decrypted)
    } else {
      // Compatibilidad con versión anterior (XOR simple)
      return decryptLegacyData(data)
    }
  } catch (error) {
    console.error("Error al descifrar datos:", error)
    return null
  }
}

/**
 * Función para descifrar datos con el método antiguo (XOR)
 * Mantiene compatibilidad con datos cifrados anteriormente
 */
function decryptLegacyData(encryptedData: string): any {
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
    console.error("Error al descifrar datos con método antiguo:", error)
    return null
  }
}

/**
 * Genera una cadena aleatoria de la longitud especificada
 */
function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const randomValues = new Uint8Array(length)

  // Usar crypto.getRandomValues si está disponible
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(randomValues)
  } else {
    // Fallback para entornos sin crypto
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256)
    }
  }

  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length)
  }

  return result
}

/**
 * Implementación personalizada de cifrado similar a AES
 * Nota: En producción, usa bibliotecas criptográficas estándar como CryptoJS
 */
function customAESEncrypt(text: string, key: string, iv: string): string {
  // Derivar una clave más larga del key y iv
  const derivedKey = deriveKey(key, iv)

  // Convertir texto a array de bytes
  const textBytes = stringToBytes(text)

  // Cifrar bytes
  const encryptedBytes = []
  for (let i = 0; i < textBytes.length; i++) {
    // Aplicar operaciones de sustitución y permutación
    const keyByte = derivedKey.charCodeAt(i % derivedKey.length)
    const ivByte = iv.charCodeAt(i % iv.length)
    const substituted = (textBytes[i] + keyByte) % 256
    const permuted = substituted ^ ivByte

    encryptedBytes.push(permuted)
  }

  // Convertir bytes cifrados a string Base64
  return bytesToBase64(encryptedBytes)
}

/**
 * Implementación personalizada de descifrado
 */
function customAESDecrypt(encryptedBase64: string, key: string, iv: string): string {
  // Derivar la misma clave
  const derivedKey = deriveKey(key, iv)

  // Convertir Base64 a array de bytes
  const encryptedBytes = base64ToBytes(encryptedBase64)

  // Descifrar bytes
  const decryptedBytes = []
  for (let i = 0; i < encryptedBytes.length; i++) {
    const keyByte = derivedKey.charCodeAt(i % derivedKey.length)
    const ivByte = iv.charCodeAt(i % iv.length)

    // Revertir las operaciones de permutación y sustitución
    const unpermuted = encryptedBytes[i] ^ ivByte
    const unsubstituted = (unpermuted - keyByte + 256) % 256

    decryptedBytes.push(unsubstituted)
  }

  // Convertir bytes descifrados a string
  return bytesToString(decryptedBytes)
}

/**
 * Deriva una clave más larga a partir de la clave y el IV
 */
function deriveKey(key: string, salt: string): string {
  let result = ""

  // Mezclar key y salt
  for (let i = 0; i < 32; i++) {
    const keyChar = key.charCodeAt(i % key.length)
    const saltChar = salt.charCodeAt(i % salt.length)
    const mixed = (keyChar + saltChar + i) % 256
    result += String.fromCharCode(mixed)
  }

  return result
}

/**
 * Convierte un string a array de bytes
 */
function stringToBytes(str: string): number[] {
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i))
  }
  return bytes
}

/**
 * Convierte un array de bytes a string
 */
function bytesToString(bytes: number[]): string {
  return bytes.map((byte) => String.fromCharCode(byte)).join("")
}

/**
 * Convierte un array de bytes a string Base64
 */
function bytesToBase64(bytes: number[]): string {
  return btoa(bytesToString(bytes))
}

/**
 * Convierte un string Base64 a array de bytes
 */
function base64ToBytes(base64: string): number[] {
  const str = atob(base64)
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i))
  }
  return bytes
}
