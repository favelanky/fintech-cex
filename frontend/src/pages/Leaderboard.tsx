import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LeaderboardUser {
  id: number;
  name: string;
  points: number;
  totalTrades: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaderboard');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">Trader Leaderboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Trader</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Points</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Total Trades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${user.rank === 1 ? 'bg-yellow-500 text-black' : 
                          user.rank === 2 ? 'bg-gray-300 text-black' :
                          user.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-gray-700 text-gray-300'}
                      `}>
                        {user.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-400 font-medium">
                    {user.points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">
                    {user.totalTrades.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 