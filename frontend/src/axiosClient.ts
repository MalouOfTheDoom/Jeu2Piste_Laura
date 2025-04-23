// src/clients/axiosProjectX.ts
import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // or use import.meta.env if you want it dynamic
  timeout: 5000,
})

export default axiosClient
