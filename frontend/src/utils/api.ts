const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = {
  async get(path: string, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const response = await fetch(`${API_BASE_URL}${path}`, { headers })
    return response.json()
  },

  async post(path: string, data: unknown, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async put(path: string, data: unknown, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(path: string, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers,
    })
    return response.json()
  },

  async patch(path: string, data: unknown, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })
    return response.json()
  },
}

export default api
