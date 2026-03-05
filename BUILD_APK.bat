@echo off
echo ========================================
echo PlantIQ APK Builder
echo ========================================
echo.

REM Check if Android SDK is installed
if not defined ANDROID_HOME (
    echo ERROR: Android SDK not found!
    echo.
    echo Please choose an installation method:
    echo.
    echo 1. Run install-android-sdk.ps1 ^(Right-click -^> Run with PowerShell^)
    echo 2. Install Android Studio from https://developer.android.com/studio
    echo 3. Use GitHub Actions ^(see BUILD_APK_NOW.md^)
    echo.
    pause
    exit /b 1
)

echo Android SDK found at: %ANDROID_HOME%
echo.
echo Building APK...
echo This may take 2-5 minutes...
echo.

cd android
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo APK Location:
    echo %CD%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Opening APK folder...
    start "" "%CD%\app\build\outputs\apk\debug"
) else (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
    echo Common solutions:
    echo 1. Run: gradlew clean
    echo 2. Delete android\.gradle folder
    echo 3. Restart computer and try again
    echo.
)

cd ..
pause
