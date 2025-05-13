"use client"

import GitHubDeploymentGuide from "@/components/github-deployment-guide"

export default function DeploymentGuidePage() {
  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Guía de Despliegue</h1>
      <GitHubDeploymentGuide />
    </div>
  )
}
