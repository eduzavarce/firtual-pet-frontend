"use client"
import Link from "next/link"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {apiService} from "@/lib/services/api"

export function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setIsAuthenticated(apiService.isAuthenticated())
    }, [])

    const handleLogout = () => {
        apiService.logout()
        setIsAuthenticated(false)
        router.push("/")
    }

    return (
        <nav className="sticky top-0 z-50 bg-card border-b-4 border-border shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="font-comic text-3xl font-bold text-primary skew-slight">
                    UGLY TOONS
                </Link>
                <div className="hidden md:flex space-x-6 items-center">
                    <Link href="/" className="font-bold text-foreground hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="#about" className="font-bold text-foreground hover:text-primary transition-colors">
                        About
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard"
                                  className="font-bold text-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            {apiService.isAdmin() && (
                                <Link href="/backoffice"
                                      className="font-bold text-foreground hover:text-primary transition-colors">
                                    Backoffice
                                </Link>
                            )}
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="font-bold chunky-border bg-transparent"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/login" className="font-bold text-foreground hover:text-primary transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
