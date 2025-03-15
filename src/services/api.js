import { getAuthHeaders, handleApiResponse } from './auth'

export const API_URL = import.meta.env.PROD 
  ? 'https://api.mgoods.uz/api'
  : 'http://127.0.0.1:8000/api'

export async function fetchProducts(page = 1, { sortColumn, sortOrder, ...filters } = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = new URLSearchParams()
    
    // Pagination
    queryParams.append('page', page)
    if (filters.per_page) queryParams.append('limit', filters.per_page)
    
    // Sorting
    if (sortColumn) queryParams.append('sortColumn', sortColumn)
    if (sortOrder) queryParams.append('sortOrder', sortOrder)
    
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