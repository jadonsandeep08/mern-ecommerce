@echo off
title MERN Ecommerce Launcher

echo ========================================
echo       MERN Ecommerce Application
echo ========================================
echo.

echo Starting Backend Server...
start "MERN Backend" cmd /k "cd /d C:\xampp\htdocs\mern-ecommerce\server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting React Frontend...
start "MERN Frontend" cmd /k "cd /d C:\xampp\htdocs\mern-ecommerce\client && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening MERN Ecommerce...
start "" "http://localhost:5173/"

echo.
echo Application started successfully.
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:5000/
echo Admin:    http://localhost:5173/admin
echo Cart:     http://localhost:5173/cart
echo Checkout: http://localhost:5173/checkout
echo.

exit