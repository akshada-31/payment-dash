// src/services/api.ts
import axios from 'axios';
import { getToken } from '../utils/auth'; // ✅ Use your cross-platform wrapper

const api = axios.create({
    baseURL: 'http://localhost:3001',
    // ✅ replace with your IP or backend host
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
