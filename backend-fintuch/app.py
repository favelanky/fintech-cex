from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
CORS(app, origins=['http://localhost:3000'])

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    @staticmethod
    def hash_password(password):
        return bcrypt.generate_password_hash(password).decode('utf-8')

    @staticmethod
    def check_password(hash, password):
        return bcrypt.check_password_hash(hash, password)
    

class Wallet(db.Model):
    __tablename__ = 'wallets'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    balance = db.Column(db.Float, default=0)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(4), nullable=False) 
    date = db.Column(db.String(20), nullable=False) 


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(4), nullable=False) 
    status = db.Column(db.String(10), nullable=False, default='active') 
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class UserPoints(db.Model):
    __tablename__ = 'user_points'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    points = db.Column(db.Integer, default=0)
    total_trades = db.Column(db.Integer, default=0)

with app.app_context():
    db.create_all()

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email is already registered'}), 400
        
        hashed_password = User.hash_password(password)
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not User.check_password(user.password, password):
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({'token': access_token}), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
    
@app.route('/api/wallet', methods=['GET'])
@jwt_required()
def get_wallet():
    user_id = get_jwt_identity()
    wallet = Wallet.query.filter_by(user_id=user_id).all()
    wallet_data = [{"currency": item.currency, "balance": item.balance} for item in wallet]
    return jsonify(wallet_data), 200

@app.route('/api/check', methods=['GET'])
@jwt_required()
def check_tocken():
    user_id = get_jwt_identity()
    return jsonify({"user_id": user_id}), 200

@app.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    transaction_data = [{
        "id": item.id,
        "currency": item.currency,
        "amount": item.amount,
        "price": item.price,
        "type": item.type,
        "date": item.date
    } for item in transactions]
    return jsonify(transaction_data), 200


from datetime import datetime

@app.route('/api/wallet/deposit', methods=['POST'])
@jwt_required()
def deposit():
    user_id = get_jwt_identity()
    data = request.get_json()
    currency = data.get('currency')
    amount = data.get('amount')

    if not all([currency, amount]):
        return jsonify({"error": "Missing data"}), 400

    wallet = Wallet.query.filter_by(user_id=user_id, currency=currency).first()
    if wallet:
        wallet.balance += amount
    else:
        wallet = Wallet(user_id=user_id, currency=currency, balance=amount)
        db.session.add(wallet)

    db.session.commit()
    return jsonify({"message": "Deposit successful", "currency": currency, "amount": amount}), 200


@app.route('/api/wallet/withdraw', methods=['POST'])
@jwt_required()
def withdraw():
    user_id = get_jwt_identity()
    data = request.get_json()
    currency = data.get('currency')
    amount = data.get('amount')

    if not all([currency, amount]):
        return jsonify({"error": "Currency and amount are required"}), 400
    
    wallet = Wallet.query.filter_by(user_id=user_id, currency=currency).first()
    if not wallet:
        return jsonify({"error": "Wallet for the specified currency not found"}), 404

    if wallet.balance < amount:
        return jsonify({"error": "Insufficient balance"}), 400

    # Уменьшить баланс
    wallet.balance -= amount
    db.session.commit()

    return jsonify({"message": "Withdrawal successful", "currency": currency, "remaining_balance": wallet.balance}), 200

@app.route('/api/popular_currencies', methods=['GET'])
def get_popular_currencies():
    popular_currencies = [
        "BTC", "ETH", "USDC",
    ]
    return jsonify(popular_currencies), 200

def match_orders(new_order):
    try:
        opposite_type = 'sell' if new_order.type == 'buy' else 'buy'
        
        if new_order.type == 'buy':
            matching_orders = Order.query.filter_by(
                currency=new_order.currency, 
                type=opposite_type, 
                status='active'
            ).filter(Order.price <= new_order.price).order_by(Order.price.asc()).all()
        else:
            matching_orders = Order.query.filter_by(
                currency=new_order.currency, 
                type=opposite_type, 
                status='active'
            ).filter(Order.price >= new_order.price).order_by(Order.price.desc()).all()

        remaining_amount = new_order.amount

        for matching_order in matching_orders:
            if remaining_amount <= 0:
                break

            if new_order.type == 'buy':
                seller_wallet = Wallet.query.filter_by(
                    user_id=matching_order.user_id, 
                    currency=new_order.currency
                ).first()
            else:
                seller_wallet = Wallet.query.filter_by(
                    user_id=new_order.user_id, 
                    currency=new_order.currency
                ).first()

            if not seller_wallet or seller_wallet.balance < matching_order.amount:
                continue
            trade_amount = min(remaining_amount, matching_order.amount)
            trade_price = matching_order.price
            
            if not can_execute_trade(new_order, matching_order, trade_amount, trade_price):
                continue

            remaining_amount -= trade_amount
            matching_order.amount -= trade_amount

            if matching_order.amount == 0:
                matching_order.status = 'filled'

            transaction1 = Transaction(
                user_id=new_order.user_id,
                currency=new_order.currency,
                amount=trade_amount,
                price=trade_price,
                type=new_order.type,
                date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
            
            transaction2 = Transaction(
                user_id=matching_order.user_id,
                currency=matching_order.currency,
                amount=trade_amount,
                price=trade_price,
                type=opposite_type,
                date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )

            if new_order.type == 'buy':
                buyer_id, seller_id = new_order.user_id, matching_order.user_id
            else:
                buyer_id, seller_id = matching_order.user_id, new_order.user_id

            if not update_wallets(buyer_id, seller_id, new_order.currency, trade_amount, trade_price):
                db.session.rollback()
                continue

            db.session.add(transaction1)
            db.session.add(transaction2)

        new_order.amount = remaining_amount
        if remaining_amount == 0:
            new_order.status = 'filled'

        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        return False
def can_execute_trade(new_order, matching_order, trade_amount, trade_price):
    """Проверка возможности выполнения сделки"""
    try:
        if new_order.type == 'buy':
            seller_wallet = Wallet.query.filter_by(
                user_id=matching_order.user_id,
                currency=new_order.currency
            ).first()

            if not seller_wallet or seller_wallet.balance < trade_amount:
                return False

        else:  # sell
            seller_wallet = Wallet.query.filter_by(
                user_id=new_order.user_id,
                currency=new_order.currency
            ).first()

            if not seller_wallet or seller_wallet.balance < trade_amount:
                return False

        return True

    except Exception as e:
        return False
def update_wallets(buyer_id, seller_id, currency, amount, price):
    try:
        seller_wallet = Wallet.query.filter_by(user_id=seller_id, currency=currency).first()
        if not seller_wallet or seller_wallet.balance < amount:
            return False

        buyer_wallet = Wallet.query.filter_by(user_id=buyer_id, currency=currency).first()
        if not buyer_wallet:
            buyer_wallet = Wallet(user_id=buyer_id, currency=currency, balance=0)
            db.session.add(buyer_wallet)

        if not seller_wallet:
            seller_wallet = Wallet(user_id=seller_id, currency=currency, balance=0)
            db.session.add(seller_wallet)

        if seller_wallet.balance >= amount:
            buyer_wallet.balance += amount
            seller_wallet.balance -= amount
            db.session.commit()
            return True

        return False

    except Exception as e:
        db.session.rollback()
        return False

@app.route('/api/orderbook/create', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        currency = data.get('currency')
        amount = float(data.get('amount', 0))
        price = float(data.get('price', 0))
        order_type = data.get('type')

        if not all([currency, amount, price, order_type]):
            return jsonify({"error": "Missing required fields"}), 400

        if order_type == 'sell':
            wallet = Wallet.query.filter_by(user_id=user_id, currency=currency).first()
            if not wallet or wallet.balance < amount:
                return jsonify({"error": "Insufficient balance"}), 400

        if amount <= 0 or price <= 0:
            return jsonify({"error": "Invalid amount or price"}), 400

        new_order = Order(
            user_id=user_id,
            currency=currency,
            amount=amount,
            price=price,
            type=order_type,
            status='active'
        )
        

        db.session.add(new_order)

        points = int(10 * amount)
        user_points = UserPoints.query.filter_by(user_id=user_id).first()
        if user_points:
            user_points.points += points
            user_points.total_trades += 1
        else:
            user_points = UserPoints(user_id=user_id, points=points, total_trades=1)
            db.session.add(user_points)

        db.session.commit()

        if match_orders(new_order):
            return jsonify({
                "message": "Order created and matched successfully",
                "order_id": new_order.id,
                "status": new_order.status
            }), 201
        else:
            return jsonify({"error": "Error matching orders"}), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/orderbook/<currency>', methods=['GET'])
def get_orderbook(currency):
    try:
        buy_orders = Order.query.filter_by(
            currency=currency,
            type='buy',
            status='active'
        ).order_by(Order.price.desc()).all()

        sell_orders = Order.query.filter_by(
            currency=currency,
            type='sell',
            status='active'
        ).order_by(Order.price.asc()).all()

        orderbook = {
            "buy_orders": [{
                "price": order.price,
                "amount": order.amount,
                "total": order.price * order.amount
            } for order in buy_orders],
            "sell_orders": [{
                "price": order.price,
                "amount": order.amount,
                "total": order.price * order.amount
            } for order in sell_orders]
        }

        return jsonify(orderbook), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        leaderboard = db.session.query(
            User.id,
            User.email.label('name'),  # Using email as name since we don't have name field
            UserPoints.points,
            UserPoints.total_trades,
            db.func.rank().over(
                order_by=UserPoints.points.desc()
            ).label('rank')
        ).outerjoin(
            UserPoints, User.id == UserPoints.user_id
        ).order_by(
            UserPoints.points.desc().nullslast()
        ).limit(100).all()

        result = [{
            'id': user.id,
            'name': user.name,
            'points': user.points or 0,
            'totalTrades': user.total_trades or 0,
            'rank': user.rank
        } for user in leaderboard]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        user_points = UserPoints.query.get(user_id)
        
        week_ago = datetime.utcnow() - timedelta(days=7)
        
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        recent_transactions = Transaction.query.filter(
            Transaction.user_id == user_id,
            Transaction.date >= week_ago.strftime('%Y-%m-%d')
        ).count()
        
        total_buy_volume = sum(t.price * t.amount for t in transactions if t.type == 'buy')
        total_sell_volume = sum(t.price * t.amount for t in transactions if t.type == 'sell')

        return jsonify({
            "email": user.email,
            "points": user_points.points if user_points else 0,
            "totalTrades": user_points.total_trades if user_points else 0,
            "rank": get_user_rank(user_id),
            "transactions": {
                "totalBuyVolume": total_buy_volume,
                "totalSellVolume": total_sell_volume,
                "recentTransactions": recent_transactions
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

def get_user_rank(user_id):
    try:
        result = db.session.query(
            db.func.rank().over(
                order_by=UserPoints.points.desc()
            ).label('rank')
        ).filter(
            UserPoints.user_id == user_id
        ).first()
        return result[0] if result else 0
    except Exception:
        return 0

if __name__ == '__main__':
    app.run(debug=True)