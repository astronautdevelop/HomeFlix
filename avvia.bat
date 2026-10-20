@echo off
start "Backend" cmd /k "cd /d "%~dp0backend" && npm run start:dev"
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"