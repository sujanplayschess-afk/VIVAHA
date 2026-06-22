@echo off
set PHP_DIR=%~dp0php74
set INSTALL_DIR=%~dp0
"%PHP_DIR%\php.exe" -S 0.0.0.0:8000 -t "%INSTALL_DIR%public" "%INSTALL_DIR%server.php"
