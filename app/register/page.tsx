"use client"
import type React from "react"
import {useState} from "react"

import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Navbar} from "@/components/layout/navbar"
import {Footer} from "@/components/layout/footer"
import {apiService} from "@/lib/services/api"
import Link from "next/link"
import {v4 as uuidv4} from "uuid"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (formData.password !== formData.repeatPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            await apiService.createUser({
                id: uuidv4(),
                username: formData.username,
                email: formData.email,
                password: formData.password,
                repeatPassword: formData.repeatPassword,
            })

            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar/>
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-md mx-auto text-center">
                        <Card className="chunky-border border-border bg-card">
                            <CardContent className="p-8">
                                <h2 className="font-comic text-3xl font-bold text-primary mb-4">ACCOUNT CREATED!</h2>
                                <p className="text-foreground font-bold mb-4">
                                    Welcome to the Ugly Toons family! Redirecting you to login...
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto">
                    <Card className="chunky-border border-border bg-card">
                        <CardHeader className="text-center">
                            <CardTitle className="font-comic text-4xl font-bold text-primary skew-slight">JOIN UGLY
                                TOONS</CardTitle>
                            <p className="text-muted-foreground font-bold">Create your account and adopt your first
                                abomination</p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {error && (
                                <Alert className="border-destructive bg-destructive/10">
                                    <AlertDescription className="text-destructive font-bold">{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="font-bold text-foreground">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="chunky-border border-border"
                                        placeholder="your_username"
                                        pattern="^[A-Za-z0-9_-]+$"
                                        minLength={3}
                                        maxLength={20}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-bold text-foreground">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="chunky-border border-border"
                                        placeholder="Strong password"
                                        minLength={8}
                                        maxLength={30}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Must contain uppercase, lowercase, number, and special character
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="repeatPassword" className="font-bold text-foreground">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="repeatPassword"
                                        name="repeatPassword"
                                        type="password"
                                        value={formData.repeatPassword}
                                        onChange={handleChange}
                                        required
                                        className="chunky-border border-border"
                                        placeholder="Repeat your password"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full font-comic text-xl py-6 chunky-border bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-200"
                                >
                                    {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                                </Button>
                            </form>

                            <div className="text-center pt-4 border-t border-border">
                                <p className="text-muted-foreground font-bold">
                                    Already have an account?{" "}
                                    <Link href="/login"
                                          className="text-primary hover:text-primary/80 font-bold underline">
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer/>
        </div>
    )
}
