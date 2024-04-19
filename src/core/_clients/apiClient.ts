import axios from 'axios'

export const apiClient = {
  get: async <T>(endpoint: string, options?: { params?: any }) => {
    const { data } = await axios.get(endpoint, options)
    return data as T
  },
}
