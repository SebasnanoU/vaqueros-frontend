"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarRating } from "@/components/star-rating"
// Importar el componente MapPicker
import { MapPin } from "lucide-react"
import { MapPicker } from "@/components/map-picker"

interface Partner {
  id: string
  name: string
  lastName: string
  instagram: string
  nickname: string
}

interface FormProps {
  formData: {
    userPartners?: Partner[]
  }
  onSubmit: (responses: any) => void
}

export function Form({ formData, onSubmit }: FormProps) {
  const [activeTab, setActiveTab] = useState("pareja")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Añadir estados para controlar el diálogo del mapa
  const [isPlanMapOpen, setIsPlanMapOpen] = useState(false)
  const [isEncounterMapOpen, setIsEncounterMapOpen] = useState(false)

  // Form state
  const [formState, setFormState] = useState({
    // Pareja section
    isNewPartner: "",
    selectedPartnerId: "",
    partnerName: "",
    partnerLastName: "",
    partnerInstagram: "",
    partnerNickname: "",

    // Plan section
    hasPlan: "",
    planType: "",
    planDetails: "",
    planDate: null as Date | null,
    planTime: "",
    planIsNow: false,
    isAtPlanLocation: "",
    planLocationComment: "",
    planLocation: { lat: null as number | null, lng: null as number | null },

    // Encuentro section
    hasEncounter: "",
    encounterStartDate: null as Date | null,
    encounterStartTime: "",
    encounterEndDate: null as Date | null,
    encounterEndTime: "",
    encounterRating: 0,
    encounterWouldRepeat: false,
    encounterMemorable: false,
    encounterComment: "",
    isAtEncounterLocation: "",
    encounterLocationComment: "",
    encounterLocation: { lat: null as number | null, lng: null as number | null },
    encounterInitiative: "",
  })

  const updateFormState = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNextTab = () => {
    if (activeTab === "pareja") setActiveTab("plan")
    else if (activeTab === "plan") setActiveTab("encuentro")
  }

  const handlePrevTab = () => {
    if (activeTab === "encuentro") setActiveTab("plan")
    else if (activeTab === "plan") setActiveTab("pareja")
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Submit the form data
    onSubmit(formState).finally(() => {
      setIsSubmitting(false)
    })
  }

  const isPartnerSectionComplete = () => {
    if (formState.isNewPartner === "no") {
      return !!formState.selectedPartnerId
    } else if (formState.isNewPartner === "yes") {
      return !!formState.partnerName && !!formState.partnerLastName
    }
    return false
  }

  const isPlanSectionComplete = () => {
    if (formState.hasPlan === "no") return true
    if (formState.hasPlan === "yes") {
      return !!formState.planType && (!!formState.planDate || formState.planIsNow)
    }
    return false
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pareja">Pareja</TabsTrigger>
          <TabsTrigger value="plan" disabled={!isPartnerSectionComplete()}>
            Plan
          </TabsTrigger>
          <TabsTrigger value="encuentro" disabled={!isPlanSectionComplete()}>
            Encuentro
          </TabsTrigger>
        </TabsList>

        {/* PAREJA SECTION */}
        <TabsContent value="pareja" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Pareja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>¿Es una pareja nueva?</Label>
                <RadioGroup
                  value={formState.isNewPartner}
                  onValueChange={(value) => updateFormState("isNewPartner", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="new-partner-yes" />
                    <Label htmlFor="new-partner-yes">Sí, es una pareja nueva</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="new-partner-no" />
                    <Label htmlFor="new-partner-no">No, ya está registrada</Label>
                  </div>
                </RadioGroup>
              </div>

              {formState.isNewPartner === "no" && formData.userPartners && formData.userPartners.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="partner-select">Selecciona una pareja</Label>
                  <Select
                    value={formState.selectedPartnerId}
                    onValueChange={(value) => updateFormState("selectedPartnerId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una pareja" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.userPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name} {partner.lastName} ({partner.nickname})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formState.isNewPartner === "yes" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="partner-name">Nombre</Label>
                      <Input
                        id="partner-name"
                        value={formState.partnerName}
                        onChange={(e) => updateFormState("partnerName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partner-lastname">Apellido</Label>
                      <Input
                        id="partner-lastname"
                        value={formState.partnerLastName}
                        onChange={(e) => updateFormState("partnerLastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-instagram">Instagram</Label>
                    <Input
                      id="partner-instagram"
                      value={formState.partnerInstagram}
                      onChange={(e) => updateFormState("partnerInstagram", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-nickname">Apodo</Label>
                    <Input
                      id="partner-nickname"
                      value={formState.partnerNickname}
                      onChange={(e) => updateFormState("partnerNickname", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="button" onClick={handleNextTab} disabled={!isPartnerSectionComplete()}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLAN SECTION */}
        <TabsContent value="plan" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>¿Hubo un plan?</Label>
                <RadioGroup
                  value={formState.hasPlan}
                  onValueChange={(value) => updateFormState("hasPlan", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="has-plan-yes" />
                    <Label htmlFor="has-plan-yes">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="has-plan-no" />
                    <Label htmlFor="has-plan-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formState.hasPlan === "yes" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan-type">Tipo de plan</Label>
                    <Select value={formState.planType} onValueChange={(value) => updateFormState("planType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comer">Comer</SelectItem>
                        <SelectItem value="bailar">Bailar</SelectItem>
                        <SelectItem value="pola">Pola</SelectItem>
                        <SelectItem value="netflix">Netflix</SelectItem>
                        <SelectItem value="ver-partido">Ver partido</SelectItem>
                        <SelectItem value="estudiar">Estudiar</SelectItem>
                        <SelectItem value="de-momento">De momento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plan-details">Detalles</Label>
                    <Textarea
                      id="plan-details"
                      value={formState.planDetails}
                      onChange={(e) => updateFormState("planDetails", e.target.value)}
                      placeholder="Describe los detalles del plan"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="plan-is-now"
                        checked={formState.planIsNow}
                        onCheckedChange={(checked) => updateFormState("planIsNow", checked)}
                      />
                      <Label htmlFor="plan-is-now">El plan es ahora</Label>
                    </div>

                    {!formState.planIsNow && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !formState.planDate && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formState.planDate ? (
                                    format(formState.planDate, "PPP", { locale: es })
                                  ) : (
                                    <span>Selecciona una fecha</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formState.planDate}
                                  onSelect={(date) => updateFormState("planDate", date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="plan-time">Hora</Label>
                            <Input
                              id="plan-time"
                              type="time"
                              value={formState.planTime || ""}
                              onChange={(e) => updateFormState("planTime", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>¿Estás en el lugar del plan?</Label>
                      <RadioGroup
                        value={formState.isAtPlanLocation}
                        onValueChange={(value) => updateFormState("isAtPlanLocation", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="at-plan-location-yes" />
                          <Label htmlFor="at-plan-location-yes">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="at-plan-location-no" />
                          <Label htmlFor="at-plan-location-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formState.isAtPlanLocation === "yes" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                updateFormState("planLocation", {
                                  lat: position.coords.latitude,
                                  lng: position.coords.longitude,
                                })
                              },
                              (error) => {
                                console.error("Error getting location:", error)
                                alert("No se pudo obtener tu ubicación. Por favor, intenta de nuevo.")
                              },
                            )
                          } else {
                            alert("La geolocalización no está disponible en tu navegador")
                          }
                        }}
                        className="w-full"
                      >
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        Usar mi ubicación actual
                      </Button>
                    )}

                    {formState.isAtPlanLocation === "no" && (
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPlanMapOpen(true)}
                          className="w-full"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Seleccionar ubicación en el mapa
                        </Button>
                        {formState.planLocation.lat !== null && formState.planLocation.lng !== null && (
                          <div className="text-sm text-muted-foreground mt-2">
                            Ubicación seleccionada: {formState.planLocation.lat.toFixed(6)},{" "}
                            {formState.planLocation.lng.toFixed(6)}
                          </div>
                        )}
                        <MapPicker
                          open={isPlanMapOpen}
                          onOpenChange={setIsPlanMapOpen}
                          onLocationSelect={(location) => updateFormState("planLocation", location)}
                          initialLocation={formState.planLocation}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevTab}>
                  Anterior
                </Button>
                <Button type="button" onClick={handleNextTab}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ENCUENTRO SECTION */}
        <TabsContent value="encuentro" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Encuentro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>¿Hubo un encuentro?</Label>
                <RadioGroup
                  value={formState.hasEncounter}
                  onValueChange={(value) => updateFormState("hasEncounter", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="has-encounter-yes" />
                    <Label htmlFor="has-encounter-yes">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="has-encounter-no" />
                    <Label htmlFor="has-encounter-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formState.hasEncounter === "yes" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha inicio</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formState.encounterStartDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formState.encounterStartDate ? (
                              format(formState.encounterStartDate, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formState.encounterStartDate}
                            onSelect={(date) => updateFormState("encounterStartDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="encounter-start-time">Hora inicio</Label>
                      <Input
                        id="encounter-start-time"
                        type="time"
                        value={formState.encounterStartTime || ""}
                        onChange={(e) => updateFormState("encounterStartTime", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Fecha fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formState.encounterEndDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formState.encounterEndDate ? (
                              format(formState.encounterEndDate, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formState.encounterEndDate}
                            onSelect={(date) => updateFormState("encounterEndDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="encounter-end-time">Hora fin</Label>
                      <Input
                        id="encounter-end-time"
                        type="time"
                        value={formState.encounterEndTime || ""}
                        onChange={(e) => updateFormState("encounterEndTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Calificación</Label>
                    <StarRating
                      value={formState.encounterRating}
                      onChange={(rating) => updateFormState("encounterRating", rating)}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="would-repeat"
                        checked={formState.encounterWouldRepeat}
                        onCheckedChange={(checked) => updateFormState("encounterWouldRepeat", checked)}
                      />
                      <Label htmlFor="would-repeat">Repetiría</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="memorable"
                        checked={formState.encounterMemorable}
                        onCheckedChange={(checked) => updateFormState("encounterMemorable", checked)}
                      />
                      <Label htmlFor="memorable">Memorable</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encounter-comment">Comentario</Label>
                    <Textarea
                      id="encounter-comment"
                      value={formState.encounterComment}
                      onChange={(e) => updateFormState("encounterComment", e.target.value)}
                      placeholder="Deja un comentario sobre el encuentro"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>¿Estás en el lugar del encuentro?</Label>
                      <RadioGroup
                        value={formState.isAtEncounterLocation}
                        onValueChange={(value) => updateFormState("isAtEncounterLocation", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="at-encounter-location-yes" />
                          <Label htmlFor="at-encounter-location-yes">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="at-encounter-location-no" />
                          <Label htmlFor="at-encounter-location-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formState.isAtEncounterLocation === "yes" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                updateFormState("encounterLocation", {
                                  lat: position.coords.latitude,
                                  lng: position.coords.longitude,
                                })
                              },
                              (error) => {
                                console.error("Error getting location:", error)
                                alert("No se pudo obtener tu ubicación. Por favor, intenta de nuevo.")
                              },
                            )
                          } else {
                            alert("La geolocalización no está disponible en tu navegador")
                          }
                        }}
                        className="w-full"
                      >
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        Usar mi ubicación actual
                      </Button>
                    )}

                    {formState.isAtEncounterLocation === "no" && (
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEncounterMapOpen(true)}
                          className="w-full"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Seleccionar ubicación en el mapa
                        </Button>
                        {formState.encounterLocation.lat !== null && formState.encounterLocation.lng !== null && (
                          <div className="text-sm text-muted-foreground mt-2">
                            Ubicación seleccionada: {formState.encounterLocation.lat.toFixed(6)},{" "}
                            {formState.encounterLocation.lng.toFixed(6)}
                          </div>
                        )}
                        <MapPicker
                          open={isEncounterMapOpen}
                          onOpenChange={setIsEncounterMapOpen}
                          onLocationSelect={(location) => updateFormState("encounterLocation", location)}
                          initialLocation={formState.encounterLocation}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Iniciativa</Label>
                    <RadioGroup
                      value={formState.encounterInitiative}
                      onValueChange={(value) => updateFormState("encounterInitiative", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gol" id="initiative-gol" />
                        <Label htmlFor="initiative-gol">Gol</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asistencia" id="initiative-asistencia" />
                        <Label htmlFor="initiative-asistencia">Asistencia</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto-gol" id="initiative-auto-gol" />
                        <Label htmlFor="initiative-auto-gol">Auto Gol</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevTab}>
                  Anterior
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
