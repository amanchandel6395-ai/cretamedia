@echo off
title CRETA MEDIA - WhatsApp QR Connect
color 0a

echo ========================================================
echo   📱 CRETA MEDIA - WhatsApp Instant QR Connect
echo ========================================================
echo.
echo  Starting WhatsApp Bridge on port 3005...
echo  Opening browser to scan QR code: http://localhost:3000/whatsapp
echo.

start http://localhost:3000/whatsapp
node whatsapp-bot.cjs
pause
