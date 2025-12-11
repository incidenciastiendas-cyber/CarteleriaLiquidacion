@echo off
title Carteleria Liquidacion - GDN Argentina
cls
echo ========================================
echo   Carteleria Liquidacion
echo   GDN Argentina
echo ========================================
echo.
echo Iniciando servidor local...
echo.
echo IMPORTANTE: NO CERRAR ESTA VENTANA
echo La aplicacion se abrira automaticamente
echo.
echo Para cerrar la app: Cierra el navegador
echo y presiona Ctrl+C aqui
echo ========================================
echo.

REM Inicia el servidor web en puerto 8080
powershell -Command "Start-Process 'http://localhost:8080/index.html'; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host 'Servidor iniciado en http://localhost:8080'; Write-Host 'Presiona Ctrl+C para detener el servidor'; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $path = $request.Url.LocalPath; if ($path -eq '/') { $path = '/index.html' }; $filepath = Join-Path (Get-Location) $path.TrimStart('/'); if (Test-Path $filepath) { $content = [System.IO.File]::ReadAllBytes($filepath); $response.ContentType = switch ([System.IO.Path]::GetExtension($filepath)) { '.html' { 'text/html; charset=utf-8' } '.css' { 'text/css; charset=utf-8' } '.js' { 'application/javascript; charset=utf-8' } '.png' { 'image/png' } '.jpg' { 'image/jpeg' } '.svg' { 'image/svg+xml' } '.ttf' { 'font/ttf' } '.csv' { 'text/csv; charset=utf-8' } default { 'application/octet-stream' } }; $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); } else { $response.StatusCode = 404; $notfound = [System.Text.Encoding]::UTF8.GetBytes('404 - Archivo no encontrado'); $response.OutputStream.Write($notfound, 0, $notfound.Length); }; $response.Close(); }"
