import React, { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  id: number;
  currency: string;
  amount: number;
  price: number;
  type: "buy" | "sell";
  date: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-gray-100">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Transaction History</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="overflow-y-auto max-h-[500px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                <th className="p-2 text-left font-medium text-gray-400">Type</th>
                <th className="p-2 text-left font-medium text-gray-400">Currency</th>
                <th className="p-2 text-right font-medium text-gray-400">Amount</th>
                <th className="p-2 text-right font-medium text-gray-400">Price</th>
                <th className="p-2 text-right font-medium text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-800/50">
                  <td className={`p-2 font-medium ${
                    transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type.toUpperCase()}
                  </td>
                  <td className="p-2">{transaction.currency}</td>
                  <td className="p-2 text-right">{transaction.amount.toFixed(4)}</td>
                  <td className="p-2 text-right">{transaction.price.toFixed(2)}</td>
                  <td className="p-2 text-right text-gray-400">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">No transactions found</div>
      )}
    </div>
  );
};

export default TransactionHistory;
