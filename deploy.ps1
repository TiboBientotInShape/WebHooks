$ErrorActionPreference = "Stop"

if (-not $env:REPO_URL) { throw "Missing REPO_URL" }
if (-not $env:DEPLOY_DIR) { throw "Missing DEPLOY_DIR" }
if (-not $env:TARGET_BRANCH) { $env:TARGET_BRANCH = "main" }

Write-Host "== Deploy started ==" -ForegroundColor Cyan
Write-Host "Repo: $env:REPO_URL"
Write-Host "Dir: $env:DEPLOY_DIR"
Write-Host "Branch: $env:TARGET_BRANCH"

$deployDir = $env:DEPLOY_DIR

# Créer le dossier parent si nécessaire
$parentDir = Split-Path -Parent $deployDir
if ($parentDir -and -not (Test-Path $parentDir)) {
    New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
}

if (-not (Test-Path "$deployDir\.git")) {
    Write-Host "Cloning..." -ForegroundColor Yellow
    git clone --branch $env:TARGET_BRANCH $env:REPO_URL $deployDir
} else {
    Write-Host "Pulling latest..." -ForegroundColor Yellow
    git -C $deployDir fetch --all
    git -C $deployDir checkout $env:TARGET_BRANCH
    git -C $deployDir pull --ff-only
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
Set-Location $deployDir
npm install

Write-Host "Starting app..." -ForegroundColor Yellow

# Lire les scripts npm disponibles
$npmScripts = (npm run) | Out-String

# Si l'app React a été créée avec create-react-app
if ($npmScripts -match "\sstart\s") {
    Start-Process -FilePath "npm.cmd" -ArgumentList "run","start" -RedirectStandardOutput "app.log" -RedirectStandardError "app.err.log"
    Write-Host "Started with: npm run start" -ForegroundColor Green
}
# Si l'app React a été créée avec Vite
elseif ($npmScripts -match "\sdev\s") {
    Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev","--","--host","0.0.0.0" -RedirectStandardOutput "app.log" -RedirectStandardError "app.err.log"
    Write-Host "Started with: npm run dev" -ForegroundColor Green
}
else {
    throw "No start/dev script found in package.json"
}

Write-Host "== Deploy done ==" -ForegroundColor Cyan
