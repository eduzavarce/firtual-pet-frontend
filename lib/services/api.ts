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
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return response.json()
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
