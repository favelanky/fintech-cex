import React, { useState } from 'react';
import axios from 'axios';

const DepositForm: React.FC<{ onClose: () => void; onDepositSuccess: () => void }> = ({ onClose, onDepositSuccess }) => {
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post('/api/wallet/deposit', {
                currency,
                amount,
                price
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setMessage('Deposit successful');
            onDepositSuccess(); // Обновляем кошелёк после пополнения
            onClose(); // Закрываем форму
        } catch (error) {
            console.error('Deposit failed', error);
            setMessage('Deposit failed');
        }
    };

    return (
        <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Currency</label>
                    <input
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Deposit
                </button>
            </form>
            <button onClick={onClose} className="mt-4 text-red-500 hover:underline">Cancel</button>
        </div>
    );
};

export default DepositForm;
