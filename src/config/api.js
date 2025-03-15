const isDevelopment = import.meta.env.DEV

export const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8000/api'
  : 'https://api.mgoods.uz/api'

export default {
  API_URL
}
