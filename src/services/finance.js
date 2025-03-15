import { getAuthHeaders, handleApiResponse } from './auth'

const API_URL = 'http://127.0.0.1:8000/api'

export async function fetchTransactions() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/transactions/get`, { headers })
    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }
}

export async function fetchTransfers() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/transfers/get`, { headers })
    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    console.error('Error fetching transfers:', error)
    throw error
  }
}
