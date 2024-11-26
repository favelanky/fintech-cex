import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LayoutDashboard, Wallet2, UserCircle, LogOut, Trophy } from 'lucide-react';

interface NavbarProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated }) => {
    const { logout } = useAuth();

    return (
        <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                CEX
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/wallet"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <Wallet2 className="w-4 h-4 mr-2" />
                                    Wallet
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <UserCircle className="w-4 h-4 mr-2" />
                                    Profile
                                </Link>
                                <Link
                                    to="/leaderboard"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Leaderboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 border border-blue-400 hover:border-blue-300 rounded-lg transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
