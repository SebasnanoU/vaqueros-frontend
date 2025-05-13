import { encryptData, decryptData } from "@/lib/encryption"

describe("Encryption Module", () => {
  // Set environment variables for testing
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = "test-encryption-key-for-jest"
    process.env.NEXT_PUBLIC_ENCRYPTION_VERSION = "2.0"
    process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION = "true"
  })

  test("should encrypt and decrypt data correctly", () => {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      sensitive: "secret information",
    }

    // Encrypt the data
    const encrypted = encryptData(testData)

    // Verify encryption produces a non-empty string
    expect(encrypted).toBeTruthy()
    expect(typeof encrypted).toBe("string")
    expect(encrypted.length).toBeGreaterThan(20)

    // Decrypt the data
    const decrypted = decryptData(encrypted)

    // Verify decryption returns the original data
    expect(decrypted).toEqual(testData)
  })

  test("should handle empty data", () => {
    const emptyData = {}

    const encrypted = encryptData(emptyData)
    expect(encrypted).toBeTruthy()

    const decrypted = decryptData(encrypted)
    expect(decrypted).toEqual(emptyData)
  })

  test("should handle null and undefined", () => {
    // Test with null
    const encryptedNull = encryptData(null)
    expect(encryptedNull).toBeTruthy()
    const decryptedNull = decryptData(encryptedNull)
    expect(decryptedNull).toBeNull()

    // Test with undefined (will be converted to null in JSON)
    const encryptedUndefined = encryptData(undefined)
    expect(encryptedUndefined).toBeTruthy()
    const decryptedUndefined = decryptData(encryptedUndefined)
    expect(decryptedUndefined).toBeNull()
  })
})
