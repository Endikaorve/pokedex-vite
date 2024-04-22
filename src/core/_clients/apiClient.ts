import axios from 'axios'

export const apiClient = {
  get: async <T>(endpoint: string, options?: { params?: any }) => {
    const { data } = await axios.get<T>(endpoint, options)

    return data
  },
}
