import React, { useState } from 'react';
import axios from 'axios';

const OrderForm: React.FC = () => {
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/orderbook/create', {
                currency,
                amount,
                price,
                type: orderType,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(response.data.message);
            setCurrency('');
            setAmount('');
            setPrice('');
        } catch (error: any) {
            console.error('Failed to place order', error);
            const errorMessage = error.response?.data?.error || 'Failed to place order';
            setError(errorMessage);
        }
    };

    return (
        <div className="text-gray-100">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Place Order</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                    <div className="p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-400 text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setOrderType('buy')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            orderType === 'buy'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Buy
                    </button>
                    <button
                        type="button"
                        onClick={() => setOrderType('sell')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            orderType === 'sell'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Sell
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="" disabled>Select Currency</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                        <option value="USDC">USDC</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                        step="0.0001"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                        step="0.0001"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Place Order
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
