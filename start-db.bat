@echo off
"%~dp0mariadb\mariadb-11.4.5-winx64\bin\mariadbd.exe" --datadir="%~dp0mariadb\mariadb-11.4.5-winx64\data" --port=3307 --skip-grant-tables
