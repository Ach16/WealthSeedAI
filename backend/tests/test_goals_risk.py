def test_get_goals_empty(client, auth_headers):
    response = client.get("/api/goals/", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []

def test_create_goal(client, auth_headers):
    response = client.post(
        "/api/goals/",
        json={
            "title": "Buy a House",
            "target_amount": 500000,
            "target_date": "2030-01-01",
            "goal_type": "House Purchase"
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy a House"
    assert data["target_amount"] == 500000
    assert "id" in data

def test_submit_risk_assessment(client, auth_headers):
    response = client.post(
        "/api/risk/assessment",
        json={
            "investment_horizon": "15+ years",
            "risk_tolerance": "Moderate fluctuations acceptable",
            "income_stability": "Average",
            "emergency_fund": "3-6 months",
            "market_experience": "Intermediate"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "risk_profile" in data

def test_get_risk_profile(client, auth_headers):
    # submit first
    client.post(
        "/api/risk/assessment",
        json={
            "investment_horizon": "15+ years",
            "risk_tolerance": "Moderate fluctuations acceptable",
            "income_stability": "Average",
            "emergency_fund": "3-6 months",
            "market_experience": "Intermediate"
        },
        headers=auth_headers
    )
    
    response = client.get("/api/risk/profile", headers=auth_headers)
    assert response.status_code == 200
    assert "risk_profile" in response.json()
