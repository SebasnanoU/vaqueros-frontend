"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/form"
import { Statistics } from "@/components/statistics"
import { UserProfile } from "@/components/user-profile"
import { GoogleLogin } from "@/components/google-login"
import { encryptData, decryptData } from "@/lib/encryption"
import { saveToStorage } from "@/lib/browser-storage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

// Tipos
interface User {
  name: string
  email: string
  photoUrl: string
}

interface Partner {
  id: string
  name: string
  lastName: string
  instagram: string
  nickname: string
}

interface FormData {
  userPartners?: Partner[]
}

// Mock data que normalmente vendría del backend
const mockUserPartners: Partner[] = [
  {
    id: "1",
    name: "María",
    lastName: "González",
    instagram: "@mariag",
    nickname: "Mari",
  },
  {
    id: "2",
    name: "Carolina",
    lastName: "Rodríguez",
    instagram: "@caror",
    nickname: "Caro",
  },
  {
    id: "3",
    name: "Daniela",
    lastName: "Martínez",
    instagram: "@dani_m",
    nickname: "Dani",
  },
]

// Datos de estadísticas simulados
const mockStatistics = {
  // Estadísticas específicas de la pareja
  partnerStats: {
    totalEncounters: 8,
    averageRating: 4.5,
    testCounter: 3,
    averageDuration: "1h 45min",
    monthlyPlans: 5,
  },
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // Verificar si el usuario ya está logueado
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // En GitHub Pages no podremos usar API routes, por lo que simulamos la verificación
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          // Cargar datos del formulario
          setFormData({ userPartners: mockUserPartners })
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Manejar el login exitoso
  const handleLoginSuccess = async (userData: User, token: string) => {
    // Guardar en localStorage para persistencia
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("authToken", token)

    setUser(userData)
    setFormData({ userPartners: mockUserPartners })
  }

  // Manejar el envío del formulario
  const handleSubmit = async (formResponses: any) => {
    try {
      // Cifrar los datos del formulario antes de enviarlos
      const encryptedData = encryptData(formResponses)

      // Mostrar información de cifrado en consola (solo para desarrollo)
      if (process.env.NODE_ENV !== "production") {
        console.log("Formulario cifrado:", encryptedData)
        console.log("Formulario original (para depuración):", formResponses)
      }

      // Simular el envío de datos cifrados a un servidor
      // En un entorno real, enviaríamos encryptedData al servidor usando fetch
      const simulateServerRequest = async () => {
        // Simular latencia de red
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simular verificación en el servidor
        try {
          // Descifrar los datos para verificar que el cifrado funciona
          const decrypted = decryptData(encryptedData)

          if (!decrypted) {
            throw new Error("Error al descifrar los datos en el servidor")
          }

          // Simular respuesta exitosa del servidor
          return {
            success: true,
            message: "Datos recibidos y procesados correctamente",
            statistics: mockStatistics,
          }
        } catch (error) {
          console.error("Error en el servidor:", error)
          return {
            success: false,
            message: "Error al procesar los datos en el servidor",
            error: String(error),
          }
        }
      }

      // Ejecutar la simulación
      const response = await simulateServerRequest()

      if (response.success) {
        // Mostrar notificación de éxito
        setNotification({
          type: "success",
          message: "Formulario enviado correctamente. Los datos fueron cifrados para su seguridad.",
        })

        // Actualizar estado
        setIsSubmitted(true)
        setStatistics(response.statistics)

        // Guardar respuesta cifrada en localStorage
        saveToStorage("formResponsesEncrypted", encryptedData)

        // También guardar la fecha de envío
        saveToStorage("formSubmissionDate", new Date().toISOString())

        return true
      } else {
        // Mostrar notificación de error
        setNotification({
          type: "error",
          message: `Error al enviar el formulario: ${response.message}`,
        })

        return false
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error)

      // Mostrar notificación de error
      setNotification({
        type: "error",
        message: `Error inesperado: ${String(error)}`,
      })

      return false
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      {notification && (
        <Alert
          className={`mb-6 ${notification.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle>{notification.type === "success" ? "Éxito" : "Error"}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Formulario de Respuestas</CardTitle>
          <CardDescription>Complete el formulario para enviar sus respuestas</CardDescription>
        </CardHeader>

        <CardContent>
          {!user ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="mb-4">Por favor inicie sesión para continuar</p>
              <GoogleLogin onLoginSuccess={handleLoginSuccess} />
            </div>
          ) : (
            <>
              <UserProfile user={user} />

              {!isSubmitted ? (
                formData ? (
                  <Form formData={formData} onSubmit={handleSubmit} />
                ) : (
                  <p>Cargando formulario...</p>
                )
              ) : (
                <Statistics data={statistics} />
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          {user && !isSubmitted && (
            <p className="text-sm text-muted-foreground">Sus respuestas serán enviadas de forma segura y cifradas</p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
