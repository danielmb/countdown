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
Write-Host "Waiting for system to stabilize..."
Write-Host "Press Alt+F4 to exit kiosk mode"

# Wait for taskbar and system tray to fully load
Start-Sleep -Seconds 3

# Start Chrome in kiosk mode
# --kiosk: Fullscreen mode with no UI
# --no-first-run: Skip first run dialogs
# --disable-restore-session-state: Don't restore previous session
# --disable-infobars: Hide information bars
# --window-position=0,0: Ensure window starts at top-left
# --window-size=9999,9999: Maximize window size
Start-Process -FilePath $chromePath -ArgumentList @(
    "--kiosk",
    "$url",
    "--no-first-run",
    "--disable-restore-session-state",
    "--disable-infobars",
    "--window-position=0,0"
)

# Give Chrome a moment to start, then ensure it's focused
Start-Sleep -Seconds 2

# Try to bring Chrome to foreground using Windows API
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WindowHelper {
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@

# Find Chrome window and bring it to front
$chromeProcess = Get-Process chrome -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -ne ""} | Select-Object -First 1
if ($chromeProcess) {
    [WindowHelper]::ShowWindow($chromeProcess.MainWindowHandle, 3) # SW_MAXIMIZE
    [WindowHelper]::SetForegroundWindow($chromeProcess.MainWindowHandle)
}

Write-Host "Chrome started in kiosk mode!"
