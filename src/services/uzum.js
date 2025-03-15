const UZUM_API_URL = 'https://api-seller.uzum.uz/api/seller'

// Helper function to handle Uzum API errors
const handleUzumError = (error) => {
  if (!error.response?.data) {
    throw new Error('Network error')
  }

  const { errors } = error.response.data

  if (!errors || errors.length === 0) {
    throw new Error('Unknown error occurred')
  }

  const errorCode = errors[0].code
  
  switch (errorCode) {
    case '001-invoice-not-found':
    case 'fbs-invoice-01':
      throw new Error('Nakladnoy raqam notogri')
    case 'forbidden-001':
      throw new Error('Do\'kon ID notogri')
    case 'unauthorized-001':
      throw new Error('TOKEN Eskirgan, yangilang')
    default:
      throw new Error(errors[0].message || 'Unknown error occurred')
  }
}

export async function fetchUzumFBAShipment(shopId, invoiceId, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    
    const response = await fetch(
      `${UZUM_API_URL}/shop/${shopId}/invoice/getInvoiceProducts?invoiceId=${invoiceId}`,
      { headers }
    )
    
    if (!response.ok) {
      const error = new Error()
      error.response = { data: await response.json() }
      throw error
    }
    const data = await response.json()
    return Array.isArray(data) ? data : data.data || []
  } catch (error) {
    console.error('Error fetching FBA shipment:')
    handleUzumError(error)
  }
}

export async function fetchUzumFBSShipment(shopId, invoiceId, token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    
    const response = await fetch(
      `${UZUM_API_URL}/shop/${shopId}/fbs/invoice/${invoiceId}`,
      { headers }
    )
    
    if (!response.ok) {
      const error = new Error()
      error.response = { data: await response.json() }
      throw error
    }
    const data = await response.json()
    // Return the whole response for FBS since we need the payload structure
    return data
  } catch (error) {
    console.error('Error fetching FBS shipment:', error)
    handleUzumError(error)
  }
}
