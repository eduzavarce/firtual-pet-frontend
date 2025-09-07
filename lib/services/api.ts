const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface User {
  id: string
  username: string
  email: string
}

export interface Pet {
  id: string
  name: string
  health: number
  hunger: number
  stamina: number
  type: "CAT" | "RABBIT" | "DOG" | "CANARY"
  ownerId: string
  ownerUsername: string
}

export interface ApiResponse<T> {
  status: string
  data: T
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface CreateUserRequest {
  id: string
  username: string
  email: string
  password: string
  repeatPassword: string
}

export interface CreatePetRequest {
  id: string
  name: string
  type: "CAT" | "RABBIT" | "DOG" | "CANARY"
}

export interface RenamePetRequest {
  name: string
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Try to parse error JSON; if none, fallback to generic message
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText || "Network error" }))
      throw new Error((error as any).message || `HTTP ${response.status}`)
    }

    // Handle 204 No Content or empty body safely
    if (response.status === 204) {
      return undefined as unknown as T
    }

    const contentLength = response.headers.get("content-length")
    if (contentLength === "0") {
      return undefined as unknown as T
    }

    const contentType = response.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      // If body is empty, json() will throw; guard by reading text first
      const text = await response.text()
      if (!text) return undefined as unknown as T
      return JSON.parse(text) as T
    }

    // For non-JSON successful responses, return undefined
    return undefined as unknown as T
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const result: ApiResponse<LoginResponse> = await this.handleResponse(response)

    // Store token in localStorage (browser only)
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", result.data.token)
    }

    return result.data
  }

  async createUser(userData: CreateUserRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    await this.handleResponse(response)
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("auth_token")
  }

  isAdmin(): boolean {
    if (typeof window === "undefined") return false
    const token = localStorage.getItem("auth_token")
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || "")) as { roles?: string[] }
      return Array.isArray(payload.roles) && payload.roles.includes("ROLE_ADMIN")
    } catch {
      return false
    }
  }

  // Pet methods
  async getMyPets(): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets`, {
      headers: this.getAuthHeaders(),
    })

    const result: ApiResponse<Pet[]> = await this.handleResponse(response)
    return result.data
  }

  async getPetById(id: string): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}`, {
      headers: this.getAuthHeaders(),
    })

    const result: ApiResponse<Pet> = await this.handleResponse(response)
    return result.data
  }

  async createPet(petData: CreatePetRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(petData),
    })

    await this.handleResponse(response)
  }

  async deletePet(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    await this.handleResponse(response)
  }

  async renamePet(id: string, newName: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}/name`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name: newName } as RenamePetRequest),
    })

    await this.handleResponse(response)
  }

  // Pet actions
  async feedPet(id: string): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}/feed`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    const result: ApiResponse<Pet> = await this.handleResponse(response)
    return result.data
  }

  async playWithPet(id: string): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}/play`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    const result: ApiResponse<Pet> = await this.handleResponse(response)
    return result.data
  }

  async letPetSleep(id: string): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}/sleep`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    const result: ApiResponse<Pet> = await this.handleResponse(response)
    return result.data
  }

  // Admin methods
  async getAllPets(): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/backoffice/pets`, {
      headers: this.getAuthHeaders(),
    })

    const result: ApiResponse<Pet[]> = await this.handleResponse(response)
    return result.data
  }

  async deleteAnyPet(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/backoffice/pets/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    await this.handleResponse(response)
  }
}

export const apiService = new ApiService()
