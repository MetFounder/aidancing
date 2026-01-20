# PowerShell script to push code to GitHub
# Run: .\push-to-github.ps1

Write-Host "Pushing code to GitHub..." -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Download Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if already a git repo
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Cyan
    git init
    Write-Host "Git repository initialized" -ForegroundColor Green
}

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host ""
    Write-Host "WARNING: No remote repository found!" -ForegroundColor Yellow
    Write-Host ""
    $repoUrl = Read-Host "Enter GitHub repository URL (example: https://github.com/username/repo.git)"
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "Remote added: $repoUrl" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No repository URL provided. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Add all files
Write-Host ""
Write-Host "Adding files..." -ForegroundColor Cyan
git add .

# Check if there are changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to commit" -ForegroundColor Green
    exit 0
}

# Commit
Write-Host "Committing changes..." -ForegroundColor Cyan
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if (-not $commitMessage) {
    $commitMessage = "Update: AI Dancing MVP"
}
git commit -m $commitMessage

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "NOTE: First push will ask for GitHub credentials" -ForegroundColor Yellow
Write-Host ""

# Check current branch
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    git branch -M main
    $currentBranch = "main"
}

# Push
try {
    git push -u origin $currentBranch
    Write-Host ""
    Write-Host "SUCCESS: Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Check code on GitHub"
    Write-Host "   2. Setup hosting (Railway/Render/VPS)"
    Write-Host "   3. Deploy and connect domain"
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to push!" -ForegroundColor Red
    Write-Host "Check:" -ForegroundColor Yellow
    Write-Host "   - GitHub credentials correct?"
    Write-Host "   - Repository URL correct?"
    Write-Host "   - Have push permission?"
    Write-Host ""
}
