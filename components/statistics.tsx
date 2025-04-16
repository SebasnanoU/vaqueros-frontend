"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon, Clock, Calendar, Users, Award } from "lucide-react"

interface StatisticsProps {
  data: any
}

export function Statistics({ data }: StatisticsProps) {
  if (!data) {
    return <p>Cargando estadísticas...</p>
  }

  // Extraer datos específicos de las estadísticas
  const totalEncounters = data.partnerStats?.totalEncounters || 0
  const averageRating = data.partnerStats?.averageRating || 0
  const testCounter = data.partnerStats?.testCounter || 0
  const averageDuration = data.partnerStats?.averageDuration || "N/A"
  const monthlyPlans = data.partnerStats?.monthlyPlans || 0

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">¡Gracias por enviar sus respuestas!</h2>
        <p className="text-muted-foreground">Aquí puede ver algunas estadísticas</p>
      </div>

      {/* Estadísticas específicas de la pareja */}
      <div>
        <h3 className="text-lg font-medium mb-4">Estadísticas con esta pareja</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Total de encuentros</span>
                </div>
                <Badge variant="outline" className="ml-auto font-bold">
                  {totalEncounters}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>Calificación media</span>
                </div>
                <Badge variant="outline" className="ml-auto font-bold">
                  {averageRating.toFixed(1)}/5
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-500" />
                  <span>Prueba</span>
                </div>
                <Badge variant="outline" className="ml-auto font-bold">
                  {testCounter}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  <span>Tiempo medio</span>
                </div>
                <Badge variant="outline" className="ml-auto font-bold">
                  {averageDuration}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-red-500" />
                  <span>Planes este mes</span>
                </div>
                <Badge variant="outline" className="ml-auto font-bold">
                  {monthlyPlans}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
