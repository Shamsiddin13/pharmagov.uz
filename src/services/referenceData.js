import { getAuthHeaders, handleApiResponse } from './auth'

const API_URL = 'https://api.mgoods.uz/api'

async function fetchWithAuth(endpoint) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}${endpoint}`, { headers })
  return handleApiResponse(response)
}

export async function fetchUsers() {
  try {
    const data = await fetchWithAuth('/users/get')
    // Handle the specific response structure for users
    return data.data?.items || []
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export async function fetchCategories() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/categories/get`, { headers })
    const data = await handleApiResponse(response)
    return data.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function fetchStores() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/stores/get`, { headers })
    const data = await handleApiResponse(response)
    return data.data || []
  } catch (error) {
    console.error('Error fetching stores:', error)
    throw error
  }
}

export async function fetchKontragents() {
  try {
    const data = await fetchWithAuth('/kontragents/get')
    // Handle the specific response structure for kontragents
    return data.data?.items || []
  } catch (error) {
    console.error('Error fetching kontragents:', error)
    throw error
  }
}