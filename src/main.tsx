import { render } from 'preact'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import '../app/globals.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById('root') as HTMLElement
)
