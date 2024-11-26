import axios from 'axios';

const API_URL = 'http://localhost:8000/api/orders';

export const placeOrder = (type: string, amount: number, price: number) => {
    const token = localStorage.getItem('token');
    return axios.post(
        API_URL,
        { type, amount, price },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getOrderBook = () => {
    return axios.get(API_URL);
};
