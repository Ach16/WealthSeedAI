def test_get_portfolio(client, auth_headers):
    response = client.get("/api/portfolio/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "cash_balance" in data
    assert "total_value" in data

def test_update_balance(client, auth_headers):
    response = client.post(
        "/api/portfolio/balance",
        json={"new_balance": 100000},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["starting_balance"] == 100000
    assert response.json()["cash_balance"] == 100000

def test_buy_asset_success(client, auth_headers):
    # Set balance first
    client.post("/api/portfolio/balance", json={"new_balance": 100000}, headers=auth_headers)
    
    response = client.post(
        "/api/portfolio/buy",
        json={
            "symbol": "AAPL",
            "asset_name": "Apple",
            "asset_type": "Stock",
            "quantity": 10,
            "price": 150
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["symbol"] == "AAPL"
    assert data["quantity"] == 10

def test_buy_asset_insufficient_funds(client, auth_headers):
    client.post("/api/portfolio/balance", json={"new_balance": 1000}, headers=auth_headers)
    
    response = client.post(
        "/api/portfolio/buy",
        json={
            "symbol": "AAPL",
            "quantity": 10,
            "price": 150,
            "asset_name": "Apple",
            "asset_type": "Stock"
        },
        headers=auth_headers
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient cash balance"

def test_sell_asset(client, auth_headers):
    client.post("/api/portfolio/balance", json={"new_balance": 10000}, headers=auth_headers)
    
    buy_res = client.post(
        "/api/portfolio/buy",
        json={
            "symbol": "TSLA",
            "quantity": 5,
            "price": 200,
            "asset_name": "Tesla",
            "asset_type": "Stock"
        },
        headers=auth_headers
    )
    holding_id = buy_res.json()["id"]
    
    sell_res = client.post(
        "/api/portfolio/sell",
        json={
            "holding_id": holding_id,
            "quantity": 2,
            "price": 250
        },
        headers=auth_headers
    )
    assert sell_res.status_code == 200
    assert sell_res.json()["quantity"] == 3

def test_sell_more_than_owned(client, auth_headers):
    client.post("/api/portfolio/balance", json={"new_balance": 10000}, headers=auth_headers)
    
    buy_res = client.post(
        "/api/portfolio/buy",
        json={
            "symbol": "TSLA",
            "quantity": 5,
            "price": 200,
            "asset_name": "Tesla",
            "asset_type": "Stock"
        },
        headers=auth_headers
    )
    holding_id = buy_res.json()["id"]
    
    sell_res = client.post(
        "/api/portfolio/sell",
        json={
            "holding_id": holding_id,
            "quantity": 10,
            "price": 250
        },
        headers=auth_headers
    )
    assert sell_res.status_code == 400
    assert sell_res.json()["detail"] == "Cannot sell more than you own"
