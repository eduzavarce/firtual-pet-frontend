"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { apiService, type Pet } from "@/lib/services/api"
import { PetCard } from "@/components/pet/pet-card"
import { CreatePetDialog } from "@/components/pet/create-pet-dialog"

export default function DashboardPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      router.push("/login")
      return
    }

    loadPets()
  }, [router])

  const loadPets = async () => {
    try {
      const userPets = await apiService.getMyPets()
      setPets(userPets)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pets")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    apiService.logout()
    router.push("/")
  }

  const handlePetCreated = () => {
    setShowCreateDialog(false)
    loadPets()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="font-comic text-2xl text-primary">Loading your ugly pets...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-comic text-5xl font-bold text-primary skew-slight">YOUR UGLY TOONS</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="font-comic text-lg px-6 py-3 chunky-border bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              ADOPT NEW PET
            </Button>
            <Button onClick={handleLogout} variant="outline" className="font-bold chunky-border bg-transparent">
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-8 border-destructive bg-destructive/10">
            <CardContent className="p-4">
              <p className="text-destructive font-bold">{error}</p>
            </CardContent>
          </Card>
        )}

        {pets.length === 0 ? (
          <Card className="chunky-border border-border bg-card text-center">
            <CardContent className="p-12">
              <h2 className="font-comic text-3xl font-bold text-primary mb-4">NO PETS YET!</h2>
              <p className="text-foreground font-bold mb-6">
                Your collection is empty. Time to adopt your first abomination!
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="font-comic text-xl px-8 py-4 chunky-border bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                ADOPT YOUR FIRST PET
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onUpdate={loadPets} />
            ))}
          </div>
        )}
      </div>

      <CreatePetDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onPetCreated={handlePetCreated} />

      <Footer />
    </div>
  )
}
