# Formulario de Relaciones - Preact Version

Este proyecto es una aplicación de formulario construida con Next.js y Preact. Utiliza Preact como una alternativa ligera a React para mejorar el rendimiento y reducir el tamaño del bundle.

## Características

- Formulario multi-paso para registrar información sobre parejas, planes y encuentros
- Autenticación simulada con Google
- Selección de ubicación con mapas interactivos
- Almacenamiento local para persistencia de datos
- Interfaz de usuario moderna con componentes de shadcn/ui
- Optimizado para despliegue en GitHub Pages

## Tecnologías

- Next.js 14
- Preact 10 (en lugar de React)
- Tailwind CSS
- Leaflet para mapas
- shadcn/ui para componentes de interfaz

## Ventajas de Preact

- **Tamaño reducido**: Preact es aproximadamente 3KB (minificado y comprimido con gzip)
- **Rendimiento mejorado**: Más rápido que React en muchos casos de uso
- **API compatible**: Misma API moderna que React, lo que facilita la migración
- **Ideal para aplicaciones estáticas**: Perfecto para despliegues en GitHub Pages

## Configuración

El proyecto está configurado para usar Preact en lugar de React mediante alias en webpack:

\`\`\`javascript
// next.config.mjs
webpack: (config, { dev, isServer }) => {
  // Reemplazar React con Preact
  if (!dev && !isServer) {
    Object.assign(config.resolve.alias, {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    });
  }
  return config;
}
\`\`\`

## Solución de problemas

Si encuentras el error "Cannot read properties of undefined (reading '__H')", esto generalmente indica un problema de compatibilidad entre React y Preact. Asegúrate de:

1. Usar consistentemente los hooks de React (no mezclar con hooks de Preact)
2. Tener correctamente configurados los alias en webpack
3. No mezclar importaciones directas de Preact y React en el mismo componente

## Despliegue

Consulta la guía de despliegue en la aplicación para obtener instrucciones detalladas sobre cómo desplegar en GitHub Pages.
