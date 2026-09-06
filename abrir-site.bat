@echo off
echo ========================================
echo    GameHub - Sua Plataforma de Jogos
echo ========================================
echo.
echo Tentando iniciar servidor local...
echo.

:: Verificar se Python esta instalado
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python encontrado! Iniciando servidor...
    start cmd /k "cd /d "%~dp0" && python -m http.server 8080"
    timeout /t 2 /nobreak > nul
    start http://localhost:8080
    goto :end
)

:: Verificar se Python3 esta instalado
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python3 encontrado! Iniciando servidor...
    start cmd /k "cd /d "%~dp0" && python3 -m http.server 8080"
    timeout /t 2 /nobreak > nul
    start http://localhost:8080
    goto :end
)

:: Verificar se Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js encontrado! Iniciando servidor...
    start cmd /k "cd /d "%~dp0" && npx http-server -p 8080"
    timeout /t 2 /nobreak > nul
    start http://localhost:8080
    goto :end
)

:: Nenhum servidor encontrado
echo.
echo ========================================
echo    AVISO: Python ou Node.js nao encontrados!
echo ========================================
echo.
echo Para melhor experiencia, instale:
echo    - Python: https://www.python.org/downloads/
echo    - Node.js: https://nodejs.org/
echo.
echo Abrindo site diretamente (pode ter limitacoes)...
echo.
start index.html

:end
echo.
echo ========================================
echo    Site aberto com sucesso!
echo ========================================
echo.
pause
