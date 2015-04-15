echo off

::===============================================================================
::Configure needed
set OBB_PREFIX=main
set VERSION_CODE=1
set PACKAGE_NAME=com.test.apk
set EXE_7Z="C:\Program Files\7-Zip\7z.exe"
set EXE_ZIPALIGN="zipalign.exe"
::===============================================================================

if exist %EXE_7Z% (
	echo Get 7z.exe location: %EXE_7Z%
) else (
	echo 7z.exe location error: %EXE_7Z%
	goto ERROR
)

if "%1"=="" (
	echo Drag a file, please...
	goto ERROR
)

echo Get File Path: "%1"

set TARGET_FILE="%~nx1"
set TARGET_NAME="%~n1"
echo TARGET_FILE: %TARGET_FILE%
echo TARGET_NAME: %TARGET_NAME%

:: generated
set APK_NAME="obb_%TARGET_NAME%.apk"
set ALIGN_APK_NAME="aligned_obb_%TARGET_NAME%.apk"
set OBB_NAME="%OBB_PREFIX%.%VERSION_CODE%.%PACKAGE_NAME%.obb"
set OBB_FOLDER_NAME="%PACKAGE_NAME%"
set OBB_PATH="%PACKAGE_NAME%\%OBB_PREFIX%.%VERSION_CODE%.%PACKAGE_NAME%.obb"

echo PACKAGE_NAME: %PACKAGE_NAME%
echo OBB_NAME: %OBB_NAME%
echo OBB_FOLDER_NAME: %OBB_FOLDER_NAME%

copy /Y %TARGET_FILE% .\temp_apk.zip || goto ERROR
copy /Y %TARGET_FILE% .\temp_obb.zip || goto ERROR

call %EXE_7Z% d temp_apk.zip assets\res\textures\* || goto ERROR
call %EXE_7Z% d temp_obb.zip * -x!assets\res\textures\* || goto ERROR

md %OBB_FOLDER_NAME%
move /Y .\temp_apk.zip %APK_NAME% || goto ERROR
move /Y .\temp_obb.zip %OBB_PATH% || goto ERROR

:: zipalign
call %EXE_ZIPALIGN% -v 4 %APK_NAME% %ALIGN_APK_NAME% || goto ERROR

echo SUCCESS
goto EOF

:ERROR
echo ERROR

:EOF
pause
