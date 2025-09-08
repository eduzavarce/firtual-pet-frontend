"use client"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Navbar} from "@/components/layout/navbar"
import {Footer} from "@/components/layout/footer"
import {apiService, type Pet} from "@/lib/services/api"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import Image from "next/image"

const petImages = {
    CAT: "/assets/cat.png",
    RABBIT: "/assets/rabbit.png",
    DOG: "/assets/dog.png",
    CANARY: "/assets/canary.png",
} as const

export default function BackofficePage() {
    const router = useRouter()
    const [pets, setPets] = useState<Pet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmId, setConfirmId] = useState<string | null>(null)

    useEffect(() => {
        if (!apiService.isAuthenticated()) {
            router.push("/login")
            return
        }
        if (!apiService.isAdmin()) {
            router.push("/")
            return
        }
        load()
    }, [router])

    const load = async () => {
        setIsLoading(true)
        setError("")
        try {
            const allPets = await apiService.getAllPets()
            setPets(allPets)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load pets")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await apiService.deleteAnyPet(id)
            await load()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete pet")
        } finally {
            setDeletingId(null)
            setConfirmId(null)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-comic text-5xl font-bold text-primary skew-slight">BACKOFFICE</h1>
                </div>

                {isLoading ? (
                    <p className="font-comic text-2xl text-primary">Loading all pets...</p>
                ) : error ? (
                    <Card className="mb-8 border-destructive bg-destructive/10">
                        <CardContent className="p-4">
                            <p className="text-destructive font-bold">{error}</p>
                        </CardContent>
                    </Card>
                ) : pets.length === 0 ? (
                    <Card className="chunky-border border-border bg-card text-center">
                        <CardContent className="p-12">
                            <h2 className="font-comic text-3xl font-bold text-primary mb-4">NO PETS FOUND</h2>
                            <p className="text-foreground font-bold">Looks like the world is spotless. For now.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <Card key={pet.id}
                                  className="chunky-border border-border bg-card hover:bg-secondary/20 transition-all duration-300">
                                <CardHeader className="text-center">
                                    <div className="mb-4">
                                        <Image src={petImages[pet.type] || "/placeholder.svg"}
                                               alt={`${pet.name} the ${pet.type}`} width={150} height={150}
                                               className="mx-auto"/>
                                    </div>
                                    <CardTitle
                                        className="font-comic text-2xl font-bold text-card-foreground">{pet.name}</CardTitle>
                                    <p className="text-muted-foreground font-bold">{pet.type}</p>
                                    <p className="text-sm font-bold text-foreground/70">Owner: {pet.ownerUsername}</p>
                                </CardHeader>
                                <CardContent>
                                    {confirmId === pet.id ? (
                                        <div className="flex flex-col gap-3">
                                            <p className="font-bold text-foreground">Delete this pet? This cannot be
                                                undone.</p>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleDelete(pet.id)}
                                                    disabled={deletingId === pet.id}
                                                    className="font-bold chunky-border bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                    size="sm"
                                                >
                                                    {deletingId === pet.id ? "Deleting..." : "Confirm"}
                                                </Button>
                                                <Button
                                                    onClick={() => setConfirmId(null)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="font-bold chunky-border bg-transparent"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setConfirmId(pet.id)}
                                            variant="outline"
                                            size="sm"
                                            className="font-bold chunky-border bg-transparent text-destructive border-destructive"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    )
}
