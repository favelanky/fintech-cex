import React from 'react';
import { useAuth } from '../AuthContext';
import Wallet from '../components/Wallet';
import OrderForm from '../components/OrderForm';
import TransactionHistory from '../components/TransactionHistory';
import OrderBook from '../components/OrderBook';

const Home: React.FC = () => {
  const { setIsAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Wallet setIsAuthenticated={setIsAuthenticated} />
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <OrderForm />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <OrderBook />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full">
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
