"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowUpToLine, GitBranch, Code, Info } from "lucide-react"

export default function GitHubDeploymentGuide() {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitBranch className="mr-2 h-5 w-5" />
          Guía de despliegue en GitHub Pages
        </CardTitle>
        <CardDescription>Sigue estos pasos para desplegar esta aplicación en GitHub Pages</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                <span>1. Configuración del repositorio</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Crea un nuevo repositorio en GitHub</li>
                <li>
                  Inicializa Git en tu proyecto local si aún no lo has hecho:
                  <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                    <code>git init</code>
                  </pre>
                </li>
                <li>
                  Añade tus archivos y haz commit:
                  <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                    <code>
                      git add .<br />
                      git commit -m "Versión inicial"
                    </code>
                  </pre>
                </li>
                <li>
                  Añade el repositorio remoto y sube los cambios:
                  <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                    <code>
                      git remote add origin https://github.com/tu-usuario/tu-repositorio.git
                      <br />
                      git branch -M main
                      <br />
                      git push -u origin main
                    </code>
                  </pre>
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                <span>2. Configuración de next.config.mjs</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Asegúrate de que tu archivo <code>next.config.mjs</code> tenga la siguiente configuración:
              </p>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                <code>
                  {`/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configura basePath con el nombre de tu repositorio
  // (descomenta y reemplaza con tu nombre de repositorio)
  // basePath: '/tu-repositorio',
  trailingSlash: true,
  assetPrefix: './',
  // Configuración para usar Preact en lugar de React
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
  },
};

export default nextConfig;`}
                </code>
              </pre>
              <p className="mt-2 text-muted-foreground">
                Descomenta y modifica la línea <code>basePath</code> si estás desplegando en un subdirectorio.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center">
                <ArrowUpToLine className="mr-2 h-4 w-4" />
                <span>3. Construcción y despliegue</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Construye la aplicación:
                  <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                    <code>npm run build</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-1">
                    Esto generará la carpeta <code>out</code> con el contenido estático de la aplicación.
                  </p>
                </li>
                <li>
                  Configura GitHub Pages:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Ve a la configuración de tu repositorio (Settings)</li>
                    <li>Navega a "Pages" en el menú lateral</li>
                    <li>En "Source", selecciona "GitHub Actions"</li>
                  </ul>
                </li>
                <li>
                  Crea un archivo de flujo de trabajo de GitHub Actions:
                  <p className="text-sm mt-1">
                    Crea el directorio <code>.github/workflows</code> en tu proyecto y añade un archivo llamado{" "}
                    <code>deploy.yml</code> con el siguiente contenido:
                  </p>
                  <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                    <code>
                      {`name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Setup Node.js ⚙️
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies 📦
        run: npm ci

      - name: Build 🏗️
        run: npm run build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: out
          branch: gh-pages
`}
                    </code>
                  </pre>
                </li>
                <li>
                  Sube los cambios y activa el despliegue:
                  <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                    <code>
                      git add .<br />
                      git commit -m "Configurar despliegue en GitHub Pages"
                      <br />
                      git push
                    </code>
                  </pre>
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                <span>4. Notas importantes</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Rutas dinámicas:</strong> En una construcción estática, las rutas dinámicas requieren
                  configuración adicional. Considera usar <code>getStaticPaths</code> para pre-renderizar rutas
                  dinámicas.
                </li>
                <li>
                  <strong>Almacenamiento:</strong> Esta aplicación usa localStorage para persistir datos. Ten en cuenta
                  que esto es solo para demostración y no es adecuado para datos críticos o persistencia a largo plazo.
                </li>
                <li>
                  <strong>API Routes:</strong> Como GitHub Pages es un hosting estático, no podemos usar API Routes de
                  Next.js. Por eso usamos datos mock directamente en el cliente.
                </li>
                <li>
                  <strong>CORS:</strong> Si en el futuro deseas conectar esta interfaz a una API real, deberás
                  asegurarte de que esa API tenga configurado CORS correctamente para aceptar solicitudes desde tu
                  dominio de GitHub Pages.
                </li>
                <li>
                  <strong>Preact:</strong> Esta aplicación usa Preact en lugar de React para reducir el tamaño del
                  bundle y mejorar el rendimiento. Preact es una alternativa ligera a React con la misma API moderna.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Las URLs de GitHub Pages suelen ser: https://tu-usuario.github.io/tu-repositorio
        </p>
      </CardFooter>
    </Card>
  )
}
