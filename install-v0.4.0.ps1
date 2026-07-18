$ErrorActionPreference = "Stop"

$Repo = "C:\Users\clent\Documents\GitHub\WinHacks-OS-Developer-Journey"
$NestedClone = Join-Path $Repo "WinHacks-OS-Developer-Journey"
$Patch = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "1. Verificando repositorio..." -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $Repo ".git"))) {
    throw "No se encontró el repositorio Git en $Repo"
}

Write-Host "2. Eliminando clon anidado..." -ForegroundColor Cyan
if (Test-Path $NestedClone) {
    Remove-Item $NestedClone -Recurse -Force
}

Write-Host "3. Creando respaldo de archivos principales..." -ForegroundColor Cyan
$Backup = Join-Path $Repo ("backup-before-v0.4.0-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Path $Backup | Out-Null
$filesToBackup = @(
    "package.json", "README.md", "ROADMAP.md", "CHANGELOG.md",
    "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md",
    "Developer-Roadmap.md", "Learning-Guide.md"
)
foreach ($file in $filesToBackup) {
    $source = Join-Path $Repo $file
    if (Test-Path $source) {
        Copy-Item $source $Backup -Force
    }
}

Write-Host "4. Copiando la base v0.4.0..." -ForegroundColor Cyan
Get-ChildItem $Patch -Force |
    Where-Object { $_.Name -notin @("install-v0.4.0.ps1") } |
    ForEach-Object {
        Copy-Item $_.FullName $Repo -Recurse -Force
    }

Set-Location $Repo

Write-Host "5. Instalando y validando..." -ForegroundColor Cyan
npm install
npm run doctor
npm run check
npm test
npm run dev:cli -- help
npm run build

Write-Host ""
Write-Host "Actualización v0.4.0 completada." -ForegroundColor Green
Write-Host "Ahora ejecute: git status" -ForegroundColor Yellow
