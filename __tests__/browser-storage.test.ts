import { saveToStorage, getFromStorage, removeFromStorage } from "@/lib/browser-storage"

describe("Browser Storage Module", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  test("should save and retrieve data from localStorage", () => {
    const testKey = "testKey"
    const testData = { name: "Test User", id: 123 }

    // Save data to storage
    saveToStorage(testKey, testData)

    // Retrieve data from storage
    const retrievedData = getFromStorage(testKey)

    // Verify data was saved and retrieved correctly
    expect(retrievedData).toEqual(testData)
  })

  test("should return null for non-existent keys", () => {
    const nonExistentKey = "nonExistentKey"

    // Try to retrieve data for a key that doesn't exist
    const retrievedData = getFromStorage(nonExistentKey)

    // Verify null is returned
    expect(retrievedData).toBeNull()
  })

  test("should remove data from localStorage", () => {
    const testKey = "testKeyToRemove"
    const testData = { name: "Test User", id: 456 }

    // Save data to storage
    saveToStorage(testKey, testData)

    // Verify data was saved
    expect(getFromStorage(testKey)).toEqual(testData)

    // Remove data
    removeFromStorage(testKey)

    // Verify data was removed
    expect(getFromStorage(testKey)).toBeNull()
  })

  test("should handle complex data structures", () => {
    const testKey = "complexData"
    const complexData = {
      user: {
        name: "Test User",
        address: {
          street: "123 Test St",
          city: "Test City",
          zipCode: "12345",
        },
      },
      preferences: ["dark mode", "notifications"],
      active: true,
      lastLogin: new Date().toISOString(),
    }

    // Save complex data
    saveToStorage(testKey, complexData)

    // Retrieve complex data
    const retrievedData = getFromStorage(testKey)

    // Verify complex data was saved and retrieved correctly
    expect(retrievedData).toEqual(complexData)
  })
})
