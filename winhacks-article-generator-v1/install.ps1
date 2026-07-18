$ErrorActionPreference = "Stop"

$Repo = Read-Host "Ruta del proyecto WinHacks"
if ([string]::IsNullOrWhiteSpace($Repo)) {
  $Repo = "C:\Users\clent\Documents\GitHub\winhacks"
}

if (-not (Test-Path (Join-Path $Repo "package.json"))) {
  throw "No se encontró package.json en: $Repo"
}

$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
$Target = Join-Path $Repo "tools\article"
New-Item -ItemType Directory -Path $Target -Force | Out-Null
Copy-Item (Join-Path $Source "tools\article\*") $Target -Force

$PackagePath = Join-Path $Repo "package.json"
$Package = Get-Content $PackagePath -Raw | ConvertFrom-Json
if (-not $Package.scripts) {
  $Package | Add-Member -MemberType NoteProperty -Name scripts -Value ([pscustomobject]@{})
}
$Package.scripts | Add-Member -MemberType NoteProperty -Name article -Value "node tools/article/index.js" -Force
$Package.scripts | Add-Member -MemberType NoteProperty -Name winhacks -Value "node tools/article/index.js" -Force
$Package | ConvertTo-Json -Depth 20 | Set-Content $PackagePath -Encoding UTF8

Set-Location $Repo
Write-Host ""
Write-Host "Instalación completada." -ForegroundColor Green
Write-Host "Ejecute: npm run article" -ForegroundColor Yellow
