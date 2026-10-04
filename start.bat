@echo off
title MERN Ecommerce

echo ========================================
echo Starting MERN Ecommerce Application
echo ========================================
echo.

echo Starting Backend...
start "MERN Backend" cmd /k "cd /d C:\xampp\htdocs\mern-ecommerce\server && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend...
start "MERN Frontend" cmd /k "cd /d C:\xampp\htdocs\mern-ecommerce\client && npm run dev"

timeout /t 4 /nobreak >nul

echo Opening website...
start "" "http://localhost:5173/"

exit