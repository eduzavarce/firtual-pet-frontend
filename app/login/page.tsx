"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { apiService } from "@/lib/services/api"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await apiService.login({ email, password })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="chunky-border border-border bg-card">
            <CardHeader className="text-center">
              <CardTitle className="font-comic text-4xl font-bold text-primary skew-slight">
                LOGIN TO UGLY TOONS
              </CardTitle>
              <p className="text-muted-foreground font-bold">Access your collection of perfectly imperfect pets</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-destructive bg-destructive/10">
                  <AlertDescription className="text-destructive font-bold">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="chunky-border border-border"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="chunky-border border-border"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-comic text-xl py-6 chunky-border bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-200"
                >
                  {isLoading ? "LOGGING IN..." : "LOGIN"}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-border">
                <p className="text-muted-foreground font-bold">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:text-primary/80 font-bold underline">
                    Create one here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
