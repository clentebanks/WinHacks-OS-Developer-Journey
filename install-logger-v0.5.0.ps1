$ErrorActionPreference = "Stop"

$Repo = "C:\Users\clent\Documents\GitHub\WinHacks-OS-Developer-Journey"
$Patch = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path (Join-Path $Repo ".git"))) {
    throw "No se encontró el repositorio Git en $Repo"
}

Set-Location $Repo

if (-not (Test-Path "packages\core\src\index.js")) {
    throw "Primero debe estar instalada la base v0.4.0."
}

Write-Host "Copiando Logger v0.5.0..." -ForegroundColor Cyan

Get-ChildItem $Patch -Force |
    Where-Object { $_.Name -ne "install-logger-v0.5.0.ps1" } |
    ForEach-Object {
        Copy-Item $_.FullName $Repo -Recurse -Force
    }

Write-Host "Validando..." -ForegroundColor Cyan
npm install
npm run check
npm test
npm run test:logger
npm run dev:cli -- demo-log

Write-Host ""
Write-Host "Logger v0.5.0 instalado correctamente." -ForegroundColor Green
Write-Host 'Commit sugerido: git commit -m "feat(core): add reusable logger service"' -ForegroundColor Yellow
