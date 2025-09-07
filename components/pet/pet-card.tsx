"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { apiService, type Pet } from "@/lib/services/api"
import Image from "next/image"

interface PetCardProps {
  pet: Pet
  onUpdate: () => void
}

const petImages = {
  CAT: "/assets/cat.png",
  RABBIT: "/assets/rabbit.png",
  DOG: "/assets/dog.png",
  CANARY: "/assets/canary.png",
}

export function PetCard({ pet, onUpdate }: PetCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: "feed" | "play" | "sleep") => {
    setIsLoading(true)
    try {
      switch (action) {
        case "feed":
          await apiService.feedPet(pet.id)
          break
        case "play":
          await apiService.playWithPet(pet.id)
          break
        case "sleep":
          await apiService.letPetSleep(pet.id)
          break
      }
      onUpdate()
    } catch (err) {
      console.error(`Failed to ${action}:`, err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="chunky-border border-border bg-card hover:bg-secondary/20 transition-all duration-300">
      <CardHeader className="text-center">
        <div className="mb-4">
          <Image
            src={petImages[pet.type] || "/placeholder.svg"}
            alt={`${pet.name} the ${pet.type}`}
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <CardTitle className="font-comic text-2xl font-bold text-card-foreground">{pet.name}</CardTitle>
        <p className="text-muted-foreground font-bold">{pet.type}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/*<div className="space-y-2">*/}
        {/*  <div className="flex justify-between text-sm font-bold">*/}
        {/*    <span>Health</span>*/}
        {/*    <span>{pet.health}/100</span>*/}
        {/*  </div>*/}
        {/*  <Progress value={pet.health} className="h-2" />*/}
        {/*</div>*/}

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span>Hunger</span>
            <span>{pet.hunger}/100</span>
          </div>
          <Progress value={100 - pet.hunger} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span>Stamina</span>
            <span>{pet.stamina}/100</span>
          </div>
          <Progress value={pet.stamina} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4">
          <Button
            onClick={() => handleAction("feed")}
            disabled={isLoading || pet.hunger <= 0}
            size="sm"
            className="font-bold chunky-border bg-green-600 hover:bg-green-700 text-white"
          >
            Feed
          </Button>
          <Button
            onClick={() => handleAction("play")}
            disabled={isLoading || pet.stamina <= 0 || pet.hunger >= 100}
            size="sm"
            className="font-bold chunky-border bg-blue-600 hover:bg-blue-700 text-white"
          >
            Play
          </Button>
          <Button
            onClick={() => handleAction("sleep")}
            disabled={isLoading || pet.stamina >= 100}
            size="sm"
            className="font-bold chunky-border bg-purple-600 hover:bg-purple-700 text-white"
          >
            Sleep
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
