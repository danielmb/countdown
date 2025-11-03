# PowerShell script to open the countdown website in Chrome fullscreen mode
# Fullscreen = F11 mode (can still access browser controls with mouse movement)

$url = "http://localhost:3001"
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:LOCALAPPDATA}\Google\Chrome\Application\chrome.exe"
)

# Find Chrome installation
$chromePath = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromePath = $path
        break
    }
}

if (-not $chromePath) {
    Write-Error "Chrome not found! Please install Google Chrome."
    exit 1
}

Write-Host "Starting Chrome in fullscreen mode..."
Write-Host "URL: $url"
Write-Host "Press F11 to toggle fullscreen, or Alt+F4 to close"

# Start Chrome in fullscreen mode
# --start-fullscreen: Start in F11 fullscreen mode (can still access UI)
# --no-first-run: Skip first run dialogs
# --disable-restore-session-state: Don't restore previous session
Start-Process -FilePath $chromePath -ArgumentList @(
    "--start-fullscreen",
    "$url",
    "--no-first-run",
    "--disable-restore-session-state"
)

Write-Host "Chrome started in fullscreen mode!"
