# PowerShell script to open Chrome in kiosk mode and auto-hide Windows taskbar
# This ensures nothing appears over the fullscreen browser

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

Write-Host "Configuring taskbar to auto-hide..."

# Set taskbar to auto-hide
Add-Type @"
using System;
using System.Runtime.InteropServices;

public class Taskbar {
    [DllImport("user32.dll")]
    private static extern IntPtr FindWindow(string className, string windowText);
    
    [DllImport("user32.dll")]
    private static extern int ShowWindow(IntPtr hwnd, int command);
    
    private const int SW_HIDE = 0;
    private const int SW_SHOW = 5;
    
    public static void Hide() {
        IntPtr hwnd = FindWindow("Shell_TrayWnd", null);
        ShowWindow(hwnd, SW_HIDE);
    }
    
    public static void Show() {
        IntPtr hwnd = FindWindow("Shell_TrayWnd", null);
        ShowWindow(hwnd, SW_SHOW);
    }
}
"@

# Hide the taskbar
[Taskbar]::Hide()

Write-Host "Starting Chrome in kiosk mode..."
Write-Host "URL: $url"
Write-Host "Taskbar is hidden. Press Alt+F4 to exit and restore taskbar."

# Wait a moment for system to stabilize
Start-Sleep -Seconds 2

# Start Chrome in kiosk mode
Start-Process -FilePath $chromePath -ArgumentList @(
    "--kiosk",
    "$url",
    "--no-first-run",
    "--disable-restore-session-state",
    "--disable-infobars",
    "--window-position=0,0"
)

Write-Host "Chrome started in kiosk mode with hidden taskbar!"
Write-Host ""
Write-Host "To restore taskbar later, run: [Taskbar]::Show() in PowerShell"
Write-Host "Or simply close Chrome and the taskbar will reappear."

# Optional: Wait for Chrome to close, then restore taskbar
# Uncomment the lines below if you want automatic taskbar restoration
# Wait-Process -Name chrome -ErrorAction SilentlyContinue
# [Taskbar]::Show()
# Write-Host "Taskbar restored."
