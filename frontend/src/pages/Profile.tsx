import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Award, ArrowUp, ArrowDown } from 'lucide-react';

interface ProfileStats {
  email: string;
  points: number;
  totalTrades: number;
  rank: number;
  transactions: {
    totalBuyVolume: number;
    totalSellVolume: number;
    recentTransactions: number;
  };
}

const Profile: React.FC = () => {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trading Stats */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-400">Rank</p>
                <p className="text-2xl font-bold text-white">#{stats?.rank || '-'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-400">Total Points</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.points.toLocaleString() || '0'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ArrowUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-400">Buy Volume</p>
                <p className="text-2xl font-bold text-white">
                  ${stats?.transactions.totalBuyVolume.toLocaleString() || '0'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ArrowDown className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-400">Sell Volume</p>
                <p className="text-2xl font-bold text-white">
                  ${stats?.transactions.totalSellVolume.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Achievement Card */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Trading Achievement</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Trades</span>
                <span className="text-white font-medium">{stats?.totalTrades || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Recent Activity</span>
                <span className="text-white font-medium">
                  {stats?.transactions.recentTransactions || 0} trades this week
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Trading Status</span>
                <span className={`font-medium ${
                  (stats?.rank || 0) <= 10 ? 'text-yellow-500' : 
                  (stats?.rank || 0) <= 50 ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {(stats?.rank || 0) <= 10 ? 'Elite Trader' : 
                   (stats?.rank || 0) <= 50 ? 'Active Trader' : 'Beginner'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
