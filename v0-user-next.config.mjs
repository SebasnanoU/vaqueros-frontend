/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configura el basePath dinámicamente basado en la variable de entorno
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  // Esto asegura que las rutas estáticas funcionen correctamente en GitHub Pages
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : './',
  // Configuración para usar Preact en lugar de React
  webpack: (config, { dev, isServer }) => {
    // Reemplazar React con Preact solo en producción y en el cliente
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime'
      });
    }
    return config;
  },
};

export default nextConfig;
