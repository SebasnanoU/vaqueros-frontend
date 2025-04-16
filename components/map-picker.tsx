"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface MapPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLocationSelect: (location: { lat: number; lng: number }) => void
  initialLocation?: { lat: number | null; lng: number | null }
}

export function MapPicker({ open, onOpenChange, onLocationSelect, initialLocation }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation?.lat && initialLocation?.lng ? { lat: initialLocation.lat, lng: initialLocation.lng } : null,
  )

  // Cargar el mapa cuando el componente se monte y el diálogo esté abierto
  useEffect(() => {
    if (!open || !mapRef.current || map) return

    // Importar Leaflet dinámicamente
    const loadLeaflet = async () => {
      // @ts-ignore
      const L = await import("leaflet")

      // Importar estilos de Leaflet
      await import("leaflet/dist/leaflet.css")

      // Inicializar el mapa
      const initialLat = initialLocation?.lat || 4.6097
      const initialLng = initialLocation?.lng || -74.0817

      const newMap = L.map(mapRef.current).setView([initialLat, initialLng], 13)

      // Añadir capa de mapa
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap)

      // Añadir marcador inicial si hay una ubicación inicial
      let newMarker
      if (initialLocation?.lat && initialLocation?.lng) {
        newMarker = L.marker([initialLocation.lat, initialLocation.lng], {
          draggable: true,
        }).addTo(newMap)

        newMarker.on("dragend", () => {
          const position = newMarker.getLatLng()
          setSelectedLocation({ lat: position.lat, lng: position.lng })
        })
      }

      // Manejar clics en el mapa
      newMap.on("click", (e: any) => {
        const { lat, lng } = e.latlng

        // Si ya hay un marcador, moverlo
        if (newMarker) {
          newMarker.setLatLng([lat, lng])
        } else {
          // Si no hay marcador, crear uno nuevo
          newMarker = L.marker([lat, lng], {
            draggable: true,
          }).addTo(newMap)

          newMarker.on("dragend", () => {
            const position = newMarker.getLatLng()
            setSelectedLocation({ lat: position.lat, lng: position.lng })
          })

          setMarker(newMarker)
        }

        setSelectedLocation({ lat, lng })
      })

      setMap(newMap)
      if (newMarker) setMarker(newMarker)
    }

    loadLeaflet()

    // Limpiar cuando el componente se desmonte
    return () => {
      if (map) {
        map.remove()
        setMap(null)
        setMarker(null)
      }
    }
  }, [open, initialLocation])

  // Actualizar el tamaño del mapa cuando el diálogo se abre
  useEffect(() => {
    if (open && map) {
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }
  }, [open, map])

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Selecciona una ubicación</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div ref={mapRef} className="h-[400px] w-full rounded-md border"></div>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedLocation ? (
                <span>
                  Ubicación seleccionada: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </span>
              ) : (
                <span>Haz clic en el mapa para seleccionar una ubicación</span>
              )}
            </div>
            <Button onClick={handleConfirm} disabled={!selectedLocation}>
              <MapPin className="mr-2 h-4 w-4" />
              Confirmar ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
