# PowerShell Script to Install Android Command Line Tools
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android SDK Command Line Tools Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit
}

# Define paths
$androidHome = "C:\Android"
$cmdlineToolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-9477386_latest.zip"
$downloadPath = "$env:TEMP\cmdline-tools.zip"

Write-Host "Step 1: Creating Android directory..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path "$androidHome\cmdline-tools" | Out-Null

Write-Host "Step 2: Downloading Android Command Line Tools..." -ForegroundColor Green
Write-Host "URL: $cmdlineToolsUrl" -ForegroundColor Gray
Write-Host "This may take a few minutes (150MB download)..." -ForegroundColor Yellow

try {
    Invoke-WebRequest -Uri $cmdlineToolsUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "Download completed!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to download. Please check your internet connection." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    pause
    exit
}

Write-Host "Step 3: Extracting files..." -ForegroundColor Green
Expand-Archive -Path $downloadPath -DestinationPath "$androidHome\cmdline-tools" -Force

# Rename cmdline-tools folder to latest
if (Test-Path "$androidHome\cmdline-tools\cmdline-tools") {
    Move-Item "$androidHome\cmdline-tools\cmdline-tools" "$androidHome\cmdline-tools\latest" -Force
}

Write-Host "Step 4: Setting environment variables..." -ForegroundColor Green
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidHome, 'User')
[System.Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $androidHome, 'User')

$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$newPaths = @(
    "$androidHome\cmdline-tools\latest\bin",
    "$androidHome\platform-tools",
    "$androidHome\emulator"
)

foreach ($newPath in $newPaths) {
    if ($currentPath -notlike "*$newPath*") {
        $currentPath = "$currentPath;$newPath"
    }
}

[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'User')

Write-Host "Step 5: Installing SDK components..." -ForegroundColor Green
Write-Host "This will install platform-tools, Android 33, and build-tools..." -ForegroundColor Yellow

$env:ANDROID_HOME = $androidHome
$env:ANDROID_SDK_ROOT = $androidHome
$env:Path = "$env:Path;$androidHome\cmdline-tools\latest\bin"

# Accept licenses
Write-Host "Accepting SDK licenses..." -ForegroundColor Yellow
& "$androidHome\cmdline-tools\latest\bin\sdkmanager.bat" --licenses

# Install required components
Write-Host "Installing SDK components..." -ForegroundColor Yellow
& "$androidHome\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools" "platforms;android-33" "build-tools;33.0.0"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Close and reopen your terminal/PowerShell" -ForegroundColor Yellow
Write-Host ""
Write-Host "To build your APK, run:" -ForegroundColor Cyan
Write-Host "  cd android" -ForegroundColor White
Write-Host "  .\gradlew assembleDebug" -ForegroundColor White
Write-Host ""
Write-Host "APK will be at: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
Write-Host ""

# Clean up
Remove-Item $downloadPath -Force

pause
