import { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

const OrderBook = () => {
  interface Order {
    price: number;
    amount: number;
    total: number;
    type?: 'buy' | 'sell'; // Для пользовательских ордеров
    currency: string; // Добавляем свойство currency
  }

  const [orderBook, setOrderBook] = useState<{ buy_orders: Order[]; sell_orders: Order[] }>({
    buy_orders: [],
    sell_orders: []
  });
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [loading, setLoading] = useState(true);
  const [userOrdersLoading, setUserOrdersLoading] = useState(true);

  useEffect(() => {
    fetchOrderBook();
    fetchUserOrders();
    const interval = setInterval(() => {
      fetchOrderBook();
      fetchUserOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency]);

  const fetchOrderBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orderbook/${selectedCurrency}`);
      const data = await response.json();
      setOrderBook(data);
    } catch (error) {
      console.error('Error fetching orderbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      setUserOrdersLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const response = await fetch(`http://localhost:5000/api/orders/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUserOrders(
        data.filter((order: Order) => order.currency.toUpperCase() === selectedCurrency.toUpperCase())
      );
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setUserOrdersLoading(false);
    }
  };
  

  const currencies = ['BTC', 'ETH', 'USDC'];

  return (
    <div className="text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-400">Order Book</h2>
        <div className="flex gap-2">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => setSelectedCurrency(currency)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedCurrency === currency
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Sell Orders */}
          <div>
            <h3 className="text-sm font-medium text-red-400 mb-2">Sell Orders</h3>
            <div className="bg-gray-900 rounded border border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBook.sell_orders.slice(0, 10).map((order, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="p-2 text-red-400">{order.price.toFixed(2)}</td>
                      <td className="p-2 text-right">{order.amount.toFixed(4)}</td>
                      <td className="p-2 text-right">{order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buy Orders */}
          <div>
            <h3 className="text-sm font-medium text-green-400 mb-2">Buy Orders</h3>
            <div className="bg-gray-900 rounded border border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBook.buy_orders.slice(0, 10).map((order, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="p-2 text-green-400">{order.price.toFixed(2)}</td>
                      <td className="p-2 text-right">{order.amount.toFixed(4)}</td>
                      <td className="p-2 text-right">{order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Orders Section */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-blue-400 mb-2">Your Orders</h3>
        {userOrdersLoading ? (
          <div className="flex justify-center items-center h-12">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : userOrders.length > 0 ? (
          <div className="bg-gray-900 rounded border border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map((order, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className={`p-2 font-medium ${
                      order.type === 'buy' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {order.type?.toUpperCase()}
                    </td>
                    <td className="p-2">{order.price.toFixed(2)}</td>
                    <td className="p-2 text-right">{order.amount.toFixed(4)}</td>
                    <td className="p-2 text-right">{(order.price * order.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderBook;
