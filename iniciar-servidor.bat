@echo off
echo ========================================
echo    GameHub - Iniciando Servidor Local
echo ========================================
echo.
echo Abrindo navegador...
timeout /t 2 /nobreak > nul
start http://localhost:8080
echo.
echo Iniciando servidor HTTP na porta 8080...
echo.
echo ========================================
echo    IMPORTANTE:
echo    Nao feche esta janela!
echo    Para parar: Ctrl+C
echo ========================================
echo.
python -m http.server 8080 2>nul || (
    echo Python nao encontrado. Tentando Node.js...
    npx http-server -p 8080 2>nul || (
        echo.
        echo ERRO: Python ou Node.js nao encontrados!
        echo.
        echo Instale um destes:
        - Python: https://www.python.org/downloads/
        - Node.js: https://nodejs.org/
        echo.
        pause
    )
)
