import { getAuthHeaders, handleApiResponse } from './auth'
import auth from '../stores/auth'

const API_URL = 'https://api.mgoods.uz/api'

export async function fetchStorageFilters() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${API_URL}/storages/get?page=1&per_page=1`,
      { headers }
    )
    
    const data = await handleApiResponse(response)
    return data.filters || {
      users: [],
      stores: [],
      kontragents: []
    }
  } catch (error) {
    console.error('Error fetching storage filters:', error)
    throw error
  }
}

export async function fetchStorageItems(page = 1, filters = {}) {
  try {
    const headers = await getAuthHeaders()
    
    // Ensure page and per_page are first in the query string
    const queryParams = new URLSearchParams()
    queryParams.append('page', page)
    if (filters.per_page) {
      queryParams.append('per_page', filters.per_page)
      delete filters.per_page
    }
    
    // Always force user_id filter for non-superadmin
    const requestFilters = { ...filters }
    if (!auth.isSuperAdmin && auth.user?.id) {
      requestFilters.user_id = auth.user.id.toString()
    }
    
    // Add remaining filters
    Object.entries(requestFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    
    const response = await fetch(
      `${API_URL}/storages/get?${queryParams.toString()}`,
      { headers }
    )
    
    const data = await handleApiResponse(response)
    
    // Filter data client-side as well for non-superadmin
    if (!auth.isSuperAdmin && auth.user?.id) {
      data.data = data.data.filter(item => 
        item.user_id?.toString() === auth.user.id.toString()
      )
    }
    
    return data
  } catch (error) {
    console.error('Error fetching storage items:', error)
    throw error
  }
}