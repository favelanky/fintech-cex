import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface WalletItem {
    currency: string;
    balance: number;
}

interface WalletProps {
    setIsAuthenticated: (value: boolean) => void;
}

const Wallet: React.FC<WalletProps> = ({ setIsAuthenticated }) => {
    const [wallet, setWallet] = useState<WalletItem[]>([]);
    const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([
        'BTC',
        'ETH',
        'USDC'
    ]);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');
    const [amount, setAmount] = useState<number | ''>('');
    const [action, setAction] = useState<'deposit' | 'withdraw' | null>(null);

    // Получение данных кошелька
    const fetchWallet = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/wallet', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setWallet(response.data);
        } catch (error) {
            console.error('Failed to fetch wallet data', error);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleTransaction = async () => {
        if (!amount || !selectedCurrency || !action) {
            alert('Please select a cryptocurrency and enter an amount.');
            return;
        }

        try {
            const endpoint =
                action === 'deposit'
                    ? 'http://localhost:5000/api/wallet/deposit'
                    : 'http://localhost:5000/api/wallet/withdraw';
            const response = await axios.post(
                endpoint,
                {
                    currency: selectedCurrency,
                    amount: amount,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            alert(response.data.message || 'Transaction successful.');
            setAmount('');
            setAction(null);
            setSelectedCurrency('');
            fetchWallet(); // Обновить данные после транзакции
        } catch (error) {
            console.error(`Failed to ${action} funds`, error);
            alert('Transaction failed. Please try again.');
        }
    };

    return (
        <div className="text-gray-100">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Wallet</h2>

            {/* Balances */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    {wallet.map((item, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">{item.currency}</div>
                            <div className="text-lg font-semibold">{item.balance.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => {
                        setAction('deposit');
                        setSelectedCurrency('');
                        setAmount('');
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Deposit
                </button>
                <button
                    onClick={() => {
                        setAction('withdraw');
                        setSelectedCurrency('');
                        setAmount('');
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Withdraw
                </button>
            </div>

            {/* Transaction Form */}
            {action && (
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                    <h3 className="text-lg font-medium text-blue-400 mb-4">
                        {action === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Select Cryptocurrency
                            </label>
                            <select
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                            >
                                <option value="" disabled>Select Crypto</option>
                                {availableCurrencies.map((currency, index) => (
                                    <option key={index} value={currency}>{currency}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleTransaction}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => {
                                    setAction(null);
                                    setAmount('');
                                    setSelectedCurrency('');
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
