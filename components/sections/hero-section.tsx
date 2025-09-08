"use client"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation"
import {apiService} from "@/lib/services/api"

export function HeroSection() {
    const router = useRouter()

    const handleGetStarted = () => {
        if (apiService.isAuthenticated()) {
            router.push("/dashboard")
        } else {
            router.push("/register")
        }
    }

    return (
        <section id="home" className="py-20 px-4">
            <div className="container mx-auto text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-comic text-6xl md:text-8xl font-bold text-primary mb-6 skew-slight">
                        ADOPT AN ABOMINATION
                    </h1>
                    <p className="text-xl md:text-2xl text-foreground mb-8 font-bold leading-relaxed">
                        Tired of cute? Welcome to Ugly Toons, where the pets are perfectly imperfect. Give a home to a
                        hilariously
                        hideous friend today.
                    </p>
                    <Button
                        onClick={handleGetStarted}
                        size="lg"
                        className="font-comic text-2xl px-8 py-6 chunky-border bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-200 skew-slight"
                    >
                        {apiService.isAuthenticated() ? "VIEW YOUR TOONS" : "CREATE YOUR UGLY TOON"}
                    </Button>
                </div>
            </div>
        </section>
    )
}
