"use client"
import type React from "react"
import {useState} from "react"

import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {apiService} from "@/lib/services/api"
import {v4 as uuidv4} from "uuid"

interface CreatePetDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onPetCreated: () => void
}

export function CreatePetDialog({open, onOpenChange, onPetCreated}: CreatePetDialogProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<"CAT" | "RABBIT" | "DOG" | "CANARY" | "">("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!type) return

        setIsLoading(true)
        setError("")

        try {
            await apiService.createPet({
                id: uuidv4(),
                name,
                type,
            })

            setName("")
            setType("")
            onPetCreated()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create pet")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="chunky-border border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="font-comic text-3xl font-bold text-primary text-center">
                        ADOPT A NEW ABOMINATION
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div
                            className="p-3 bg-destructive/10 border border-destructive rounded text-destructive font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="petName" className="font-bold text-foreground">
                            Pet Name
                        </Label>
                        <Input
                            id="petName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="chunky-border border-border"
                            placeholder="Give your pet a name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-foreground">Pet Type</Label>
                        <Select value={type}
                                onValueChange={(value: "CAT" | "RABBIT" | "DOG" | "CANARY") => setType(value)}>
                            <SelectTrigger className="chunky-border border-border">
                                <SelectValue placeholder="Choose your abomination"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CAT">Whiskers the Cat</SelectItem>
                                <SelectItem value="RABBIT">Barnaby the Rabbit</SelectItem>
                                <SelectItem value="DOG">Slobber the Dog</SelectItem>
                                <SelectItem value="CANARY">Screech the Canary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 font-bold chunky-border"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !name || !type}
                            className="flex-1 font-comic text-lg chunky-border bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isLoading ? "ADOPTING..." : "ADOPT PET"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
