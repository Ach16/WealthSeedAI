def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "newuser@wealthseed.ai", "password": "Password@123", "confirm_password": "Password@123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "user_id" in data

def test_register_existing_user(client, test_user):
    response = client.post(
        "/api/auth/register",
        json={"email": test_user.email, "password": "Password@123", "confirm_password": "Password@123"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "Test@123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "WrongPassword"}
    )
    assert response.status_code == 401

def test_protected_route(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "profile" in data
    assert data["profile"] is not None
    assert "literacy_score" in data["profile"]

def test_protected_route_unauthorized(client):
    response = client.get("/api/profile/")
    assert response.status_code == 401
