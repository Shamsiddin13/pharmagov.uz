const API_URL = 'https://api.mgoods.uz/api'
import { getAuthHeaders, handleApiResponse } from './auth'

export async function createUzumShipment(data) {
  try {
    const headers = await getAuthHeaders()
    
    const response = await fetch(`${API_URL}/shipments/uzum/create`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    return handleApiResponse(response)
  } catch (error) {
    console.error('Error creating Uzum shipment:', error)
    throw error
  }
}
