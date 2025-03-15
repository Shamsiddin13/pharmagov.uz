import { getAuthHeaders, handleApiResponse } from './auth'
import { API_URL } from '../config/api'

export async function fetchWarehouseHistory(page = 1, filters = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = new URLSearchParams()
    
    // Pagination
    queryParams.append('page', page)
    if (filters.per_page) queryParams.append('per_page', filters.per_page)
    
    // Filters
    if (filters.search?.trim()) queryParams.append('search', filters.search.trim())
    if (filters.sku?.trim()) queryParams.append('sku', filters.sku.trim())
    if (filters.article?.trim()) queryParams.append('article', filters.article.trim())
    if (filters.store?.trim()) queryParams.append('store', filters.store.trim())
    if (filters.from_date) queryParams.append('from_date', filters.from_date)
    if (filters.to_date) queryParams.append('to_date', filters.to_date)
    
    // Sorting
    if (filters.sort_by) {
      queryParams.append('sort_by', filters.sort_by)
    }
    if (filters.sort_order) {
      queryParams.append('sort_order', filters.sort_order)
    }
    
    const url = `${API_URL}/warehouse/history?${queryParams.toString()}`
    const response = await fetch(url, { headers })
    const data = await handleApiResponse(response)
    
    return {
      data: data.data?.items || [],
      meta: data.meta || {}
    }
  } catch (error) {
    console.error('Error fetching warehouse history:', error)
    throw error
  }
}

export async function fetchWarehouseStock(page = 1, filters = {}) {
  try {
    const headers = await getAuthHeaders()
    const queryParams = new URLSearchParams()
    
    // Pagination
    queryParams.append('page', page)
    if (filters.per_page) queryParams.append('per_page', filters.per_page)
    
    // Filters
    if (filters.search?.trim()) queryParams.append('search', filters.search.trim())
    if (filters.sku?.trim()) queryParams.append('sku', filters.sku.trim())
    if (filters.article?.trim()) queryParams.append('article', filters.article.trim())
    
    const url = `${API_URL}/warehouse/stock?${queryParams.toString()}`
    const response = await fetch(url, { headers })
    const data = await handleApiResponse(response)
    
    return {
      data: data.data?.items || [],
      meta: data.meta || {}
    }
  } catch (error) {
    console.error('Error fetching warehouse stock:', error)
    throw error
  }
}
