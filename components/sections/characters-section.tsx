"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { apiService } from "@/lib/services/api"

const characters = [
  {
    name: "BARNABY THE RABBIT",
    image: "/assets/rabbit.png",
    alt: "Barnaby the Rabbit",
  },
  {
    name: "WHISKERS THE CAT",
    image: "/assets/cat.png",
    alt: "Whiskers the Cat",
  },
  {
    name: "SLOBBER THE DOG",
    image: "/assets/dog.png",
    alt: "Slobber the Dog",
  },
  {
    name: "SCREECH THE CANARY",
    image: "/assets/canary.png",
    alt: "Screech the Canary",
  },
]

export function CharactersSection() {
  const router = useRouter()

  const handleGetStarted = () => {
    if (apiService.isAuthenticated()) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  return (
    <section id="about" className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <h2 className="font-comic text-5xl md:text-6xl font-bold text-center text-primary mb-16 skew-slight">
          OUR CAST OF CALAMITIES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {characters.map((character, index) => (
            <Card
              key={character.name}
              className={`chunky-border border-border bg-card hover:bg-secondary/20 transition-all duration-300 transform hover:scale-105 ${
                index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Image
                    src={character.image || "/placeholder.svg"}
                    alt={character.alt}
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <h3 className="font-comic text-2xl font-bold text-card-foreground">{character.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-xl font-bold text-foreground mb-6">Ready to adopt your perfectly imperfect companion?</p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="font-comic text-xl px-6 py-4 chunky-border bg-secondary hover:bg-secondary/90 text-secondary-foreground transform hover:scale-105 transition-all duration-200"
          >
            {apiService.isAuthenticated() ? "GO TO DASHBOARD" : "GET STARTED NOW"}
          </Button>
        </div>
      </div>
    </section>
  )
}
