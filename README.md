# Crypto Trading Platform

A modern cryptocurrency trading platform built with React, TypeScript, and Python Flask, featuring real-time order books, transaction history, and a trader leaderboard system.

## Features

### Trading
- Real-time order book for BTC, ETH, and USDC trading pairs
- Live transaction history
- Market and limit orders
- Wallet management system

### User Experience
- Intuitive trading interface
- Real-time price updates
- Secure authentication system
- Responsive design for all devices

### Gamification
- Points-based leaderboard system
- Trading achievements
- Trader status levels (Elite, Active, Beginner)
- Weekly trading statistics

## Technology Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Axios for API requests
- Lucide React for icons
- JWT for authentication

### Backend
- Python Flask
- SQLAlchemy ORM
- SQLite database
- JWT authentication
- CORS support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Installation

1. Clone the repository:
```sh
bash
git clone https://github.com/yourusername/crypto-trading-platform.git
cd crypto-trading-platform
```
2. Install frontend dependencies:
```sh
bash
cd frontend
npm install
```
3. Install backend dependencies:
```sh
bash
cd backend-fintuch
pip install -r requirements.txt
```
4. Start the backend server:
```sh
bash
python app.py
```
5. Start the frontend development server:
```sh
bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

### Frontend

frontend/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page components
│ ├── context/ # React context providers
│ ├── types/ # TypeScript type definitions
│ └── utils/ # Utility functions


Elite Traderfrontend/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page components
│ ├── context/ # React context providers
│ ├── types/ # TypeScript type definitions
│ └── utils/ # Utility functions

### Backend

backend-fintuch/
├── app.py # Main application file
├── models/ # Database models
├── routes/ # API routes
└── utils/ # Helper functions


## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Trading
- GET `/api/orderbook/<currency>` - Get order book for specific currency
- POST `/api/orderbook/create` - Create new order
- GET `/api/wallet` - Get user wallet information

### User Data
- GET `/api/leaderboard` - Get trader leaderboard
- GET `/api/user/profile` - Get user profile and statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


