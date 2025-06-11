import { useState } from "preact/hooks"
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface GoogleLoginProps {
  onLoginSuccess: (user: any, token: string) => void
}

export function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false)

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      try {
        const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }).then(res => res.json())

        onLoginSuccess(profile, tokenResponse.access_token)
      } catch (error) {
        console.error('Error obteniendo datos de usuario', error)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => setIsLoading(false),
  })

  return (
    <Button variant="outline" onClick={() => login()} disabled={isLoading} className="w-full max-w-sm">
      {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />}
      Iniciar sesión con Google
    </Button>
  )
}
