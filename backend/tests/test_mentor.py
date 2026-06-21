from unittest.mock import patch

def test_chat_mentor_fallback(client, auth_headers):
    # Mock the mentor_graph.invoke to raise an exception,
    # ensuring that our try/except fallback logic in mentor_service.py works
    with patch("app.ai.mentor_service.mentor_graph.invoke") as mock_invoke:
        mock_invoke.side_effect = Exception("Simulated LLM Failure")
        
        response = client.post(
            "/api/mentor/chat",
            json={"message": "Hello mentor!"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "fallback" in data.get("provider", "").lower()
        assert "trouble processing your request" in data.get("answer", "")

def test_chat_mentor_success(client, auth_headers):
    with patch("app.ai.mentor_service.mentor_graph.invoke") as mock_invoke:
        mock_invoke.return_value = {
            "final_response": "This is a mocked success response.",
            "provider_used": "mocked",
            "intent": "general",
            "emotion": "positive",
            "risk_score": 50,
            "goal_alignment_score": 80
        }
        
        response = client.post(
            "/api/mentor/chat",
            json={"message": "What is a mutual fund?"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["answer"] == "This is a mocked success response."
        assert data["provider"] == "mocked"
        assert data["insights"]["emotion"] == "positive"
