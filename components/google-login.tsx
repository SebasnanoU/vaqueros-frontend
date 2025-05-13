"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface GoogleLoginProps {
  onLoginSuccess: (user: any, token: string) => void
}

export function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // En un entorno estático como GitHub Pages, no podemos usar API routes
      // Por lo que simulamos el login

      // Esperar 1 segundo para simular la petición
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de usuario mock
      const userData = {
        name: "Usuario de Ejemplo",
        email: "usuario@ejemplo.com",
        photoUrl: "/placeholder.svg?height=40&width=40",
      }

      // Token mock
      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)

      // Llamar al handler de éxito con los datos de usuario y token
      onLoginSuccess(userData, token)
    } catch (error) {
      console.error("Error durante el login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="w-full max-w-sm">
      {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />}
      Iniciar sesión con Google
    </Button>
  )
}
