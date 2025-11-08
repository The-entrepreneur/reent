"""Test script to verify FastAPI server is running correctly"""

import subprocess
import time
import sys
import requests


def test_server():
    print("Starting FastAPI server...")

    # Start the server in a subprocess
    server = subprocess.Popen(
        [
            sys.executable,
            "-c",
            "import uvicorn; uvicorn.run('main:app', host='127.0.0.1', port=8000, log_level='error')",
        ]
    )

    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(3)

    # Test endpoints
    base_url = "http://localhost:8000"
    endpoints = ["/", "/health", "/docs", "/redoc"]

    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            print(f"✓ {endpoint}: Status {response.status_code}")
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"  Response: {data}")
                except:
                    print(f"  Response: HTML content (length: {len(response.text)})")
        except requests.exceptions.RequestException as e:
            print(f"✗ {endpoint}: {e}")

    # Stop the server
    print("Stopping server...")
    server.terminate()
    server.wait()


if __name__ == "__main__":
    test_server()
