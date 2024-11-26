import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, Shield, Zap } from 'lucide-react';

const HomeNotAuth: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
            {/* Navigation */}
            <nav className="fixed w-full top-0 z-50 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                CEX
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Trade Crypto with Confidence
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                            Experience seamless trading with advanced tools, real-time data, and institutional-grade security.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
                            >
                                Start Trading
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-400 hover:text-blue-300 border border-blue-400 hover:border-blue-300 rounded-lg transition-colors"
                            >
                                Login to Account
                            </Link>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                            <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
                                <img src="/btc-logo.svg" alt="BTC" className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Bitcoin Trading</h3>
                            <p className="text-gray-400">
                                Trade the world's leading cryptocurrency with advanced tools and liquidity.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                                <img src="/eth-logo.svg" alt="ETH" className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Ethereum Trading</h3>
                            <p className="text-gray-400">
                                Access the leading smart contract platform with competitive rates.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                                <img src="/usdc-logo.svg" alt="USDC" className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">USDC Stablecoin</h3>
                            <p className="text-gray-400">
                                Stable and secure trading with USD Coin, fully backed by reserves.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto py-8 px-4 text-center text-gray-400">
                    <p className="text-sm">
                        © {new Date().getFullYear()} CEX. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomeNotAuth;
