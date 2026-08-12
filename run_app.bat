@echo off
echo ===================================================
echo     FLAREYE - HOSPITAL FIRE SAFETY BRAIN
echo ===================================================
echo Starting FastAPI Backend Server on port 8000...
start "FLAREYE Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo Starting React Vite Frontend Server on port 3000...
start "FLAREYE Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ===================================================
echo  FLAREYE is launching!
echo  Backend:  http://127.0.0.1:8000
echo  Frontend: http://localhost:3000
echo ===================================================
timeout /t 3 >nul
start http://localhost:3000
