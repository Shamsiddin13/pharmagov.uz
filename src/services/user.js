import { getAuthHeaders, handleApiResponse } from './auth'
import auth from '../stores/auth'

const API_URL = 'https://api.mgoods.uz/api'

export async function fetchUserData() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/user`, { headers })
    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

export function useUser() {
  const refreshUser = async () => {
    return auth.refreshUser()
  }

  return {
    user: auth.user,
    isAdmin: auth.isAdmin,
    isSuperAdmin: auth.isSuperAdmin,
    isStorekeeper: auth.isStorekeeper,
    isCashier: auth.isCashier,
    refreshUser
  }
}
