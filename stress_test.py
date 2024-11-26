import requests
import random
import time
from concurrent.futures import ThreadPoolExecutor

BASE_URL = 'http://localhost:5000/api'

def login(email, password):
    print(f"Attempting to login as {email}...")
    response = requests.post(f'{BASE_URL}/auth/login', json={
        'email': email,
        'password': password
    })
    if response.status_code == 200:
        print(f"Successfully logged in as {email}")
        return response.json()['token']
    else:
        print(f"Login failed for {email}: {response.json()}")
        return None

def deposit_funds(token, bot_number):
    headers = {'Authorization': f'Bearer {token}'}
    currencies = ['BTC', 'ETH', 'USDC']
    
    for currency in currencies:
        deposit_data = {
            'currency': currency,
            'amount': 1000  # Depositing 1000 units of each currency
        }
        
        response = requests.post(f'{BASE_URL}/wallet/deposit', 
                               json=deposit_data, 
                               headers=headers)
        
        print(f'Bot {bot_number} deposited {deposit_data["amount"]} {currency}: {response.json()}')

def create_random_order(token, bot_number):
    currencies = ['BTC', 'ETH', 'USDC']
    headers = {'Authorization': f'Bearer {token}'}
    
    order = {
        'currency': random.choice(currencies),
        'amount': round(random.uniform(0.1, 2.0), 4),
        'price': round(random.uniform(100, 1000), 2),
        'type': 'buy' if random.random() > 0.5 else 'sell'
    }
    
    print(f'\nBot {bot_number} attempting to create {order["type"]} order:')
    print(f'Currency: {order["currency"]}, Amount: {order["amount"]}, Price: {order["price"]}')
    
    response = requests.post(f'{BASE_URL}/orderbook/create', 
                           json=order, 
                           headers=headers)
    
    print(f'Response: {response.json()}')
    return response.status_code

def bot_trading(bot_email, bot_password, bot_number):
    print(f"\n=== Starting Bot {bot_number} ===")
    token = login(bot_email, bot_password)
    
    if not token:
        print(f"Bot {bot_number} failed to start due to login failure")
        return
    
    print(f"\nInitializing Bot {bot_number} with deposits...")
    deposit_funds(token, bot_number)
    
    order_count = 0
    while True:
        try:
            order_count += 1
            print(f"\n--- Bot {bot_number} Order #{order_count} ---")
            create_random_order(token, bot_number)
            delay = random.uniform(1, 3)
            print(f"Waiting {delay:.2f} seconds before next order...")
            time.sleep(delay)
        except Exception as e:
            print(f"\nError in bot {bot_number}: {str(e)}")
            print("Waiting 5 seconds before retry...")
            time.sleep(5)

def main():
    print("=== Starting Trading Bot Stress Test ===")
    bots = [
        ('bot1@gmail.com', '123', 1),
        ('bot2@gmail.com', '123', 2)
    ]
    
    print("\nInitializing bots...")
    with ThreadPoolExecutor(max_workers=2) as executor:
        executor.map(lambda x: bot_trading(*x), bots)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nStopping bots gracefully...")
        print("=== Stress Test Ended ===") 