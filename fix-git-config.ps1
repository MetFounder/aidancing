# Fix Git configuration and push to GitHub
# Run: .\fix-git-config.ps1

Write-Host "Configuring Git..." -ForegroundColor Cyan
Write-Host ""

# Get GitHub username and email
$gitUsername = Read-Host "Enter your GitHub username (or press Enter for 'MetFounder')"
if (-not $gitUsername) {
    $gitUsername = "MetFounder"
}

$gitEmail = Read-Host "Enter your GitHub email (example: your@email.com)"
if (-not $gitEmail) {
    Write-Host "ERROR: Email is required!" -ForegroundColor Red
    exit 1
}

# Configure Git
Write-Host ""
Write-Host "Setting Git user.name and user.email..." -ForegroundColor Cyan
git config --global user.name $gitUsername
git config --global user.email $gitEmail

Write-Host "Git configured successfully!" -ForegroundColor Green
Write-Host ""

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "Adding remote repository..." -ForegroundColor Cyan
    $repoUrl = Read-Host "Enter GitHub repository URL"
    if ($repoUrl) {
        git remote add origin $repoUrl
    }
}

# Add and commit
Write-Host ""
Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if (-not $commitMessage) {
    $commitMessage = "Initial commit: AI Dancing MVP"
}
git commit -m $commitMessage

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "NOTE: Will ask for GitHub credentials" -ForegroundColor Yellow
Write-Host ""

# Check current branch
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    git branch -M main
    $currentBranch = "main"
}

try {
    git push -u origin $currentBranch
    Write-Host ""
    Write-Host "SUCCESS: Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Check code on GitHub: https://github.com/$gitUsername/aidancing"
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

