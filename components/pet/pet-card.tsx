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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(pet.name)
  const [renameError, setRenameError] = useState("")
  const [isSavingName, setIsSavingName] = useState(false)

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

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await apiService.deletePet(pet.id)
      onUpdate()
    } catch (err) {
      console.error("Failed to delete pet:", err)
    } finally {
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleRenameSave = async () => {
    const trimmed = newName.trim()
    if (!trimmed) {
      setRenameError("Name cannot be empty")
      return
    }
    if (trimmed === pet.name) {
      // Nothing to do
      setIsRenaming(false)
      setRenameError("")
      setNewName(pet.name)
      return
    }
    setRenameError("")
    setIsSavingName(true)
    try {
      await apiService.renamePet(pet.id, trimmed)
      setIsRenaming(false)
      onUpdate()
    } catch (err) {
      console.error("Failed to rename pet:", err)
      setRenameError(err instanceof Error ? err.message : "Failed to rename")
    } finally {
      setIsSavingName(false)
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

        {/* Rename & Delete controls */}
        <div className="mt-4 space-y-3">
          {isRenaming ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={50}
                  className="w-full px-3 py-2 rounded-md border-2 border-border chunky-border bg-background text-foreground font-bold"
                  placeholder="Enter new name"
                />
                <Button
                  onClick={handleRenameSave}
                  size="sm"
                  disabled={isSavingName}
                  className="font-bold chunky-border bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSavingName ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={() => {
                    setIsRenaming(false)
                    setNewName(pet.name)
                    setRenameError("")
                  }}
                  size="sm"
                  variant="outline"
                  className="font-bold chunky-border bg-transparent"
                >
                  Cancel
                </Button>
              </div>
              {renameError && <p className="text-destructive text-sm font-bold">{renameError}</p>}
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsRenaming(true)}
                size="sm"
                variant="outline"
                className="font-bold chunky-border bg-transparent"
              >
                Rename
              </Button>

              {confirmDelete ? (
                <>
                  <Button
                    onClick={handleDelete}
                    size="sm"
                    disabled={isDeleting}
                    className="font-bold chunky-border bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    {isDeleting ? "Deleting..." : "Confirm"}
                  </Button>
                  <Button
                    onClick={() => setConfirmDelete(false)}
                    size="sm"
                    variant="outline"
                    className="font-bold chunky-border bg-transparent"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setConfirmDelete(true)}
                  size="sm"
                  variant="outline"
                  className="font-bold chunky-border bg-transparent text-destructive border-destructive"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
