@REM Ngoài ra, vì tên file của bạn (profile 2.bat) có chứa dấu cách, bạn phải đặt tên file trong dấu ngoặc kép. Lệnh để tạo file "profile 2.bat"
cd %USERPROFILE%\Desktop\
echo off
ChromeSetup.exe
echo "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Profile 1" --process-per-site --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-features=BackForwardCache,CalculateNativeWinOcclusion --flag-switches-begin --flag-switches-end "--origin-trial-disabled-features=CanvasTextNg^|WebAssemblyCustomDescriptors" --load-extension="%USERPROFILE%\Desktop\soundcloud-extension" > "%USERPROFILE%\Desktop\profile 1.bat"
echo "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Profile 2" --process-per-site --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-features=BackForwardCache,CalculateNativeWinOcclusion --flag-switches-begin --flag-switches-end "--origin-trial-disabled-features=CanvasTextNg^|WebAssemblyCustomDescriptors" --load-extension="%USERPROFILE%\Desktop\soundcloud-extension" > "%USERPROFILE%\Desktop\profile 2.bat"
echo "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Profile 3" --process-per-site --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-features=BackForwardCache,CalculateNativeWinOcclusion --flag-switches-begin --flag-switches-end "--origin-trial-disabled-features=CanvasTextNg^|WebAssemblyCustomDescriptors" --load-extension="%USERPROFILE%\Desktop\soundcloud-extension" > "%USERPROFILE%\Desktop\profile 3.bat"
echo "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Profile 4" --process-per-site --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-features=BackForwardCache,CalculateNativeWinOcclusion --flag-switches-begin --flag-switches-end "--origin-trial-disabled-features=CanvasTextNg^|WebAssemblyCustomDescriptors" --load-extension="%USERPROFILE%\Desktop\soundcloud-extension" > "%USERPROFILE%\Desktop\profile 4.bat"

cls
echo Restore complete!
echo "change password %username%"
net user %username% "Adminis$mc.cae"