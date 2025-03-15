import { getAuthHeaders, handleApiResponse } from './auth'

export const API_URL = 'https://api.mgoods.uz/api'

export async function enterStorage(data) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/storages/enter`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return handleApiResponse(response)
  } catch (error) {
    console.error('Error in enterStorage:', error)
    throw error
  }
}

export async function lossStorage(data) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/storages/loss`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return handleApiResponse(response)
  } catch (error) {
    console.error('Error in lossStorage:', error)
    throw error
  }
}
