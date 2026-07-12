import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_register_and_login(client: AsyncClient):
    # Test registration
    reg_data = {
        "email": "testuser@ecosphere.com",
        "password": "Password123!",
        "full_name": "Test User",
        "role": "employee"
    }
    response = await client.post("/api/v1/auth/register", json=reg_data)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["email"] == reg_data["email"]
    assert res_json["data"]["role"] == "employee"

    # Test registration duplicate email conflict
    response = await client.post("/api/v1/auth/register", json=reg_data)
    assert response.status_code == 409
    res_json = response.json()
    assert res_json["success"] is False
    assert res_json["error"]["code"] == "CONFLICT"

    # Test login
    login_data = {
        "email": reg_data["email"],
        "password": reg_data["password"]
    }
    response = await client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert "access_token" in res_json["data"]
    access_token = res_json["data"]["access_token"]

    # Test login incorrect credentials
    bad_login = {
        "email": reg_data["email"],
        "password": "wrongpassword"
    }
    response = await client.post("/api/v1/auth/login", json=bad_login)
    assert response.status_code == 401
    
    # Test me endpoint
    headers = {"Authorization": f"Bearer {access_token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["email"] == reg_data["email"]

    # Test me endpoint without auth token
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
