// Tipos de ambiente
export type Environment = "development" | "quality" | "production"

// Configuración para cada ambiente
interface EnvironmentConfig {
  apiUrl: string
  mockData: boolean
  debug: boolean
  analyticsEnabled: boolean
  storagePrefix: string
  basePath: string
  mapProvider: string
  enableLocation: boolean
  enableRatings: boolean
  authProvider: string
  authSecret: string
  encryptionEnabled: boolean
  encryptionVersion: string
}

// Configuraciones por ambiente
const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  development: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    mockData: process.env.NEXT_PUBLIC_MOCK_DATA === "true",
    debug: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
    analyticsEnabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    storagePrefix: process.env.NEXT_PUBLIC_STORAGE_PREFIX || "form-app-dev",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    mapProvider: process.env.NEXT_PUBLIC_MAP_PROVIDER || "leaflet",
    enableLocation: process.env.NEXT_PUBLIC_ENABLE_LOCATION === "true",
    enableRatings: process.env.NEXT_PUBLIC_ENABLE_RATINGS === "true",
    authProvider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || "google",
    authSecret: process.env.NEXT_PUBLIC_AUTH_SECRET || "dev-secret-key",
    encryptionEnabled: process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION !== "false",
    encryptionVersion: process.env.NEXT_PUBLIC_ENCRYPTION_VERSION || "2.0",
  },
  quality: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://qa-api.example.com",
    mockData: process.env.NEXT_PUBLIC_MOCK_DATA === "true",
    debug: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
    analyticsEnabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    storagePrefix: process.env.NEXT_PUBLIC_STORAGE_PREFIX || "form-app-qa",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    mapProvider: process.env.NEXT_PUBLIC_MAP_PROVIDER || "leaflet",
    enableLocation: process.env.NEXT_PUBLIC_ENABLE_LOCATION === "true",
    enableRatings: process.env.NEXT_PUBLIC_ENABLE_RATINGS === "true",
    authProvider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || "google",
    authSecret: process.env.NEXT_PUBLIC_AUTH_SECRET || "qa-secret-key",
    encryptionEnabled: process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION !== "false",
    encryptionVersion: process.env.NEXT_PUBLIC_ENCRYPTION_VERSION || "2.0",
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
    mockData: false,
    debug: false,
    analyticsEnabled: true,
    storagePrefix: process.env.NEXT_PUBLIC_STORAGE_PREFIX || "form-app",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    mapProvider: process.env.NEXT_PUBLIC_MAP_PROVIDER || "leaflet",
    enableLocation: process.env.NEXT_PUBLIC_ENABLE_LOCATION !== "false",
    enableRatings: process.env.NEXT_PUBLIC_ENABLE_RATINGS !== "false",
    authProvider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || "google",
    authSecret: process.env.NEXT_PUBLIC_AUTH_SECRET || "",
    encryptionEnabled: true,
    encryptionVersion: process.env.NEXT_PUBLIC_ENCRYPTION_VERSION || "2.0",
  },
}

// Determina el ambiente actual basado en la URL o variables de entorno
export function getCurrentEnvironment(): Environment {
  // Verificar primero la variable de entorno
  if (process.env.NEXT_PUBLIC_ENV) {
    const env = process.env.NEXT_PUBLIC_ENV as Environment
    if (["development", "quality", "production"].includes(env)) {
      return env
    }
  }

  // En el navegador
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    const searchParams = new URLSearchParams(window.location.search)

    // Verificar si hay un parámetro de ambiente en la URL
    const envParam = searchParams.get("env")
    if (envParam && ["development", "quality", "production"].includes(envParam)) {
      return envParam as Environment
    }

    // Verificar por subdominio o path
    if (hostname.includes("dev.") || hostname.includes("localhost")) {
      return "development"
    }

    if (hostname.includes("qa.") || hostname.includes("quality.") || hostname.includes("test.")) {
      return "quality"
    }

    // Verificar por path en GitHub Pages
    const path = window.location.pathname
    if (path.includes("/dev/") || path.includes("/development/")) {
      return "development"
    }

    if (path.includes("/qa/") || path.includes("/quality/")) {
      return "quality"
    }
  }

  // En el servidor o por defecto
  return process.env.NODE_ENV === "production" ? "production" : "development"
}

// Obtiene la configuración para el ambiente actual
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getCurrentEnvironment()
  return environmentConfigs[env]
}

// Obtiene el nombre del ambiente actual para mostrar
export function getEnvironmentName(): string {
  const env = getCurrentEnvironment()
  switch (env) {
    case "development":
      return "Desarrollo"
    case "quality":
      return "Calidad"
    case "production":
      return "Producción"
    default:
      return "Desconocido"
  }
}

// Verifica si estamos en un ambiente específico
export function isEnvironment(env: Environment): boolean {
  return getCurrentEnvironment() === env
}

// Obtiene una configuración específica
export function getConfig<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
  const config = getEnvironmentConfig()
  return config[key]
}
