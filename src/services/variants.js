import { getAuthHeaders } from './auth'

const API_URL = 'https://api.mgoods.uz/api'

export async function fetchProductOptions() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/product-options/get`, { headers })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch product options')
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching product options:', error)
    throw error
  }
}

export async function fetchOptionValues(optionId) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/product-option-values/product-option/${optionId}/get`, { headers })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch option values')
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching option values:', error)
    throw error
  }
}

export async function createProductVariant(productId, variantData) {
  try {
    const headers = await getAuthHeaders()
    const formData = new FormData()

    // Add all variant data to FormData
    Object.keys(variantData).forEach(key => {
      if (variantData[key] !== null && variantData[key] !== undefined) {
        formData.append(key, variantData[key])
      }
    })

    const response = await fetch(`${API_URL}/products/product/${productId}/p-variants/create`, {
      method: 'POST',
      headers: {
        ...headers,
        // Don't set Content-Type, let the browser set it with the boundary for FormData
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create variant')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error creating variant:', error)
    throw error
  }
}
