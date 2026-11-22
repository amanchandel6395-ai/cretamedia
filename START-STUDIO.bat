@echo off
cd /d "%~dp0"
title CRETA MEDIA Studio Server (Port 3000)
color 0a
cls

echo ========================================================
echo   🎬 CRETA MEDIA — Virtual Production Studio
echo ========================================================
echo.
echo  Starting local studio server on port 3000...
echo  Opening browser at http://localhost:3000
echo.
echo  [NOTE] Keep this window open while using the website!
echo ========================================================
echo.

start http://localhost:3000

if exist "C:\Program Files\nodejs\node.exe" (
    "C:\Program Files\nodejs\node.exe" server.cjs
) else (
    node server.cjs
)

echo.
echo Server stopped.
pause
