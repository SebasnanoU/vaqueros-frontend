# Formulario de Relaciones - Preact + Vite

Este proyecto es una aplicación de formulario construida con Preact y Vite. Preact se utiliza como una alternativa ligera a React para mejorar el rendimiento y reducir el tamaño del bundle.

[![Test and Deploy to GitHub Pages](https://github.com/tu-usuario/tu-repositorio/actions/workflows/deploy.yml/badge.svg)](https://github.com/tu-usuario/tu-repositorio/actions/workflows/deploy.yml)
[![Lighthouse CI](https://github.com/tu-usuario/tu-repositorio/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/tu-usuario/tu-repositorio/actions/workflows/lighthouse.yml)

## Características

- Formulario multi-paso para registrar información sobre parejas, planes y encuentros
- Autenticación con Google mediante OAuth
- Selección de ubicación con mapas interactivos
- Almacenamiento local para persistencia de datos
- Cifrado de extremo a extremo para datos sensibles
- Interfaz de usuario moderna con componentes de shadcn/ui
- Optimizado para despliegue en GitHub Pages

## Tecnologías

- Vite
- Preact 10 (en lugar de React)
- Tailwind CSS
- Leaflet para mapas
- shadcn/ui para componentes de interfaz
- Jest para pruebas unitarias

## Desarrollo Local

1. Clona el repositorio:
   \`\`\`bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   \`\`\`

2. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Crea un archivo `.env.local` basado en `.env.example` y configura las variables de entorno.

4. Inicia el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Pruebas

Para ejecutar las pruebas unitarias:

\`\`\`bash
npm test
\`\`\`

Para ejecutar las pruebas en modo watch:

\`\`\`bash
npm run test:watch
\`\`\`

## Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a la rama `main`. El proceso de despliegue incluye:

1. Ejecución de pruebas unitarias
2. Linting del código
3. Construcción de la aplicación
4. Despliegue en la rama `gh-pages`

Para configurar el despliegue en tu propio repositorio:

1. Crea un repositorio en GitHub
2. Configura los secretos de GitHub para `ENCRYPTION_KEY` y `AUTH_SECRET` en Settings > Secrets > Actions
3. Actualiza las referencias a `tu-usuario/tu-repositorio` en los archivos README.md y package.json
4. Haz push del código a la rama `main`

## Ventajas de Preact

- **Tamaño reducido**: Preact es aproximadamente 3KB (minificado y comprimido con gzip)
- **Rendimiento mejorado**: Más rápido que React en muchos casos de uso
- **API compatible**: Misma API moderna que React, lo que facilita la migración
- **Ideal para aplicaciones estáticas**: Perfecto para despliegues en GitHub Pages

## Configuración
El proyecto utiliza Vite junto con `@preact/preset-vite` para habilitar Preact de forma transparente:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'node:path'

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
```


## Seguridad

Este proyecto implementa cifrado de extremo a extremo para los datos del formulario. Los datos se cifran antes de ser enviados y se almacenan cifrados en localStorage. La clave de cifrado se configura a través de variables de entorno.

## Solución de problemas

Si encuentras el error "Cannot read properties of undefined (reading '__H')", esto generalmente indica un problema de compatibilidad entre React y Preact. Asegúrate de:

1. Usar consistentemente los hooks de React (no mezclar con hooks de Preact)
2. Tener correctamente configurados los alias en webpack
3. No mezclar importaciones directas de Preact y React en el mismo componente

## Licencia

MIT
\`\`\`

Finalmente, vamos a crear un archivo de configuración para Dependabot para mantener las dependencias actualizadas:
