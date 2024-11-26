import axios from 'axios';

const API_URL = 'http://localhost:8000/api/wallet';

export const getBalance = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
