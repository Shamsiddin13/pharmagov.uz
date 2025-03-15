// Product-specific API calls
import { getAuthHeaders, handleApiResponse } from './auth'

const API_URL = 'https://api.mgoods.uz/api'

export async function fetchProducts(page = 1, { ...filters } = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = new URLSearchParams()
    
    // Pagination
    queryParams.append('page', page)
    if (filters.per_page) queryParams.append('per_page', filters.per_page)
    
    // Filters
    if (filters.search?.trim()) queryParams.append('search', filters.search.trim())
    if (filters.name?.trim()) queryParams.append('name', filters.name.trim())
    if (filters.sku?.trim()) queryParams.append('sku', filters.sku.trim())
    if (filters.uzum_sku?.trim()) queryParams.append('uzum_sku', filters.uzum_sku.trim())
    if (filters.ean13?.trim()) queryParams.append('ean13', filters.ean13.trim())
    if (filters.category_id && filters.category_id !== 'all') {
      queryParams.append('category_id', filters.category_id)
    }
    if (filters.store_id && filters.store_id !== 'all') {
      queryParams.append('store_id', filters.store_id)
    }
    
    const url = `${API_URL}/products/get?${queryParams.toString()}`
    const response = await fetch(url, { headers })
    const data = await handleApiResponse(response)
    
    return {
      data: data.data || [],
      meta: data.meta || {},
      categories: data.categories || [],
      stores: data.stores || []
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function fetchProductById(id, options = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = new URLSearchParams()
    
    if (options.page) {
      queryParams.append('page', options.page)
    }
    if (options.per_page) {
      queryParams.append('per_page', options.per_page)
    }

    const url = `${API_URL}/products/product/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await fetch(url, { headers })
    const data = await handleApiResponse(response)
    
    return data
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    throw new Error(error.message || 'Failed to fetch product details')
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

export async function validateUzumSku(uzumSkuTitle) {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/shipments/products/get?uzum_sku=${encodeURIComponent(uzumSkuTitle)}`
    const response = await fetch(url, { headers })
    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    console.error('Error validating Uzum SKU:', error)
    throw error
  }
}

export async function uploadProductImage(productId, imageFile, onProgress) {
  try {
    const headers = await getAuthHeaders()
    const formData = new FormData()
    formData.append('image', imageFile)

    // Create XMLHttpRequest to track upload progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded * 100) / event.total)
          onProgress(progress)
        }
      })

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            resolve(data)
          } catch (e) {
            reject(new Error(`Invalid response format: ${xhr.responseText}`))
          }
        } else {
          let errorMessage = `Upload failed: ${xhr.status} ${xhr.statusText}`
          try {
            const errorResponse = JSON.parse(xhr.responseText)
            errorMessage = errorResponse.message || errorMessage
          } catch (e) {
            // If response is not JSON, use the raw response text
            errorMessage = xhr.responseText || errorMessage
          }
          reject(new Error(errorMessage))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error occurred during upload'))
      }

      // Set up and send the request
      xhr.open('PUT', `${API_URL}/products/product/${productId}/put`)
      
      // Add authorization header
      const token = headers.Authorization
      if (token) {
        xhr.setRequestHeader('Authorization', token)
      }

      xhr.send(formData)
    })
  } catch (error) {
    console.error('Error uploading product image:', error)
    throw error
  }
}