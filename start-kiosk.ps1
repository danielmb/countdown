# PowerShell script to open the countdown website in Chrome kiosk mode
# Kiosk mode = fullscreen with no browser UI

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

Write-Host "Starting Chrome in kiosk mode..."
Write-Host "URL: $url"
Write-Host "Press Ctrl+F4 or Alt+F4 to exit kiosk mode"

# Start Chrome in kiosk mode
# --kiosk: Fullscreen mode with no UI
# --no-first-run: Skip first run dialogs
# --disable-restore-session-state: Don't restore previous session
# --disable-infobars: Hide information bars
Start-Process -FilePath $chromePath -ArgumentList @(
    "--kiosk",
    "$url",
    "--no-first-run",
    "--disable-restore-session-state",
    "--disable-infobars"
)

Write-Host "Chrome started in kiosk mode!"
