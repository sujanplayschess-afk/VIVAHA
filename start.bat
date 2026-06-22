@echo off
set PHP_DIR=C:\Users\nagar\Music\Matrimonial web portal + admin panel\dada project\php74
set INSTALL_DIR=C:\Users\nagar\Music\Matrimonial web portal + admin panel\dada project\install
"%PHP_DIR%\php.exe" -S 0.0.0.0:8000 -t "%INSTALL_DIR%" "%INSTALL_DIR%\server.php"
