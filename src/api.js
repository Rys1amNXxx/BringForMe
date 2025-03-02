import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1/',
})

api.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem('accessToken')
    console.log('JWT Token:', jwtToken)
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api