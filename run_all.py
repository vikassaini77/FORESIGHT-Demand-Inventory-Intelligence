import subprocess
import sys
import time
import os

def main():
    print("Starting Dual-Engine Retail AI Backend (FastAPI) on port 8000...")
    # Launch FastAPI
    backend = subprocess.Popen(
        [r".\venv\Scripts\python", "-m", "uvicorn", "src.app_api:app", "--reload", "--port", "8000"]
    )
    
    # Give the backend a few seconds to initialize
    time.sleep(3)
    
    print("Starting Dual-View React Frontend on port 5173...")
    # Launch React Frontend
    frontend = subprocess.Popen(
        ["npm", "run", "dev"], cwd="frontend", shell=True
    )
    
    print("\nBoth servers are now running!")
    print("Frontend Dashboard: http://localhost:5173")
    print("Backend API Docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to shut down both servers.\n")
    
    try:
        # Wait indefinitely so the script stays alive
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend.terminate()
        frontend.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
